import { useEffect, useMemo, useState } from "react"
import { PostgreSQL, sql, type SQLNamespace } from "@codemirror/lang-sql"
import { githubDark, githubLight } from "@uiw/codemirror-theme-github"
import CodeMirror, { EditorView } from "@uiw/react-codemirror"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)"

type ParsedDdlTable = {
  name: string
  schema?: string
  columns: string[]
}

export function AnalyticsSqlEditor({
  value,
  onChange,
  ddl,
  className,
  heightClassName = "h-52 max-h-52",
  editorHeight = "13rem",
  readOnly = false,
}: {
  value: string
  onChange: (value: string) => void
  ddl?: string
  className?: string
  heightClassName?: string
  editorHeight?: string
  readOnly?: boolean
}) {
  const { theme } = useTheme()
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(() =>
    typeof window !== "undefined" &&
    window.matchMedia(SYSTEM_DARK_QUERY).matches
      ? "dark"
      : "light"
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY)
    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const resolvedTheme = theme === "system" ? systemTheme : theme
  const schema = useMemo(() => createSqlSchemaFromDdl(ddl), [ddl])
  const extensions = useMemo(
    () => [
      sql({
        dialect: PostgreSQL,
        schema,
        upperCaseKeywords: true,
      }),
      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          height: "100%",
          maxHeight: editorHeight,
          fontSize: "0.875rem",
        },
        ".cm-editor": {
          height: "100%",
          maxHeight: editorHeight,
          borderRadius: "0.5rem",
          backgroundColor: "color-mix(in oklab, var(--input) 30%, transparent)",
          outline: "none",
        },
        ".cm-editor.cm-focused": {
          outline: "none",
        },
        ".cm-scroller": {
          fontFamily:
            'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          lineHeight: "1.5rem",
          overflow: "auto",
        },
        ".cm-content": {
          minHeight: editorHeight,
          padding: "0.75rem 1rem",
        },
        ".cm-line": {
          padding: 0,
        },
        ".cm-gutters": {
          display: "none",
        },
        ".cm-activeLine": {
          backgroundColor: "transparent",
        },
        ".cm-tooltip": {
          borderRadius: "0.5rem",
          borderColor: "var(--border)",
          backgroundColor: "var(--popover)",
          color: "var(--popover-foreground)",
          overflow: "hidden",
        },
        ".cm-tooltip-autocomplete ul li[aria-selected]": {
          backgroundColor: "var(--accent)",
          color: "var(--accent-foreground)",
        },
      }),
    ],
    [editorHeight, schema]
  )

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input bg-input/30 text-foreground transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        heightClassName,
        className
      )}
    >
      <CodeMirror
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        editable={!readOnly}
        theme={resolvedTheme === "dark" ? githubDark : githubLight}
        extensions={extensions}
        basicSetup={{
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          lineNumbers: false,
        }}
        height="100%"
      />
    </div>
  )
}

function createSqlSchemaFromDdl(ddl?: string): SQLNamespace | undefined {
  const tables = parseDdlTables(ddl)

  if (!tables.length) {
    return undefined
  }

  const schema: Record<string, SQLNamespace> = {}

  for (const table of tables) {
    const columns: SQLNamespace = table.columns.map((column) => ({
      label: column,
      type: "property",
    }))

    schema[table.name] = columns

    if (table.schema) {
      const namespace = schema[table.schema]
      const children: Record<string, SQLNamespace> =
        namespace && isSqlNamespaceRecord(namespace)
          ? namespace
          : {}

      children[table.name] = columns
      schema[table.schema] = children
    }
  }

  return schema
}

function isSqlNamespaceRecord(
  namespace: SQLNamespace
): namespace is Record<string, SQLNamespace> {
  return !Array.isArray(namespace) && !("self" in namespace)
}

function parseDdlTables(ddl?: string): ParsedDdlTable[] {
  if (!ddl) {
    return []
  }

  const tables: ParsedDdlTable[] = []
  const createPattern =
    /create\s+(?:or\s+replace\s+)?(?:temporary\s+|temp\s+|unlogged\s+)?(?:table|view)\s+(?:if\s+not\s+exists\s+)?((?:"[^"]+"|`[^`]+`|\[[^\]]+\]|[\w.])+)/gi

  let match: RegExpExecArray | null
  while ((match = createPattern.exec(ddl))) {
    const parsedName = parseQualifiedName(match[1])
    const bodyStart = ddl.indexOf("(", createPattern.lastIndex)
    const body = bodyStart === -1 ? "" : readParenthesizedBody(ddl, bodyStart)

    tables.push({
      ...parsedName,
      columns: parseDdlColumns(body),
    })
  }

  return tables
}

function parseQualifiedName(rawName: string) {
  const parts = rawName
    .split(".")
    .map((part) => stripIdentifierQuotes(part.trim()))
    .filter(Boolean)

  return {
    schema: parts.length > 1 ? parts.at(-2) : undefined,
    name: parts.at(-1) ?? rawName,
  }
}

function readParenthesizedBody(value: string, startIndex: number) {
  let depth = 0
  let quote: string | null = null

  for (let index = startIndex; index < value.length; index += 1) {
    const char = value[index]
    const previousChar = value[index - 1]

    if (quote) {
      if (char === quote && previousChar !== "\\") {
        quote = null
      }
      continue
    }

    if (char === "'" || char === '"' || char === "`") {
      quote = char
      continue
    }

    if (char === "(") {
      depth += 1
      continue
    }

    if (char === ")") {
      depth -= 1

      if (depth === 0) {
        return value.slice(startIndex + 1, index)
      }
    }
  }

  return ""
}

function parseDdlColumns(body: string) {
  return splitTopLevel(body)
    .map((line) => line.trim())
    .map((line) => line.replace(/--.*$/g, "").trim())
    .filter(Boolean)
    .map((line) => line.match(/^("[^"]+"|`[^`]+`|\[[^\]]+\]|\w+)/)?.[1])
    .filter((column): column is string => Boolean(column))
    .map(stripIdentifierQuotes)
    .filter((column) => !isDdlConstraintKeyword(column))
}

function splitTopLevel(value: string) {
  const parts: string[] = []
  let start = 0
  let depth = 0
  let quote: string | null = null

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    const previousChar = value[index - 1]

    if (quote) {
      if (char === quote && previousChar !== "\\") {
        quote = null
      }
      continue
    }

    if (char === "'" || char === '"' || char === "`") {
      quote = char
      continue
    }

    if (char === "(") {
      depth += 1
      continue
    }

    if (char === ")") {
      depth -= 1
      continue
    }

    if (char === "," && depth === 0) {
      parts.push(value.slice(start, index))
      start = index + 1
    }
  }

  parts.push(value.slice(start))
  return parts
}

function stripIdentifierQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("`") && value.endsWith("`")) ||
    (value.startsWith("[") && value.endsWith("]"))
  ) {
    return value.slice(1, -1)
  }

  return value
}

function isDdlConstraintKeyword(value: string) {
  return [
    "check",
    "constraint",
    "exclude",
    "foreign",
    "key",
    "primary",
    "unique",
  ].includes(value.toLowerCase())
}
