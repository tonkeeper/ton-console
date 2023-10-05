import { FieldPath, FieldValues, Noop, RefCallBack, ControllerRenderProps } from 'react-hook-form';

export function toBinaryRadio<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
    field: ControllerRenderProps<TFieldValues, TName>
): {
    value: 'true' | 'false';
    onChange: (v: 'true' | 'false') => void;
    onBlur: Noop;
    name: TName;
    ref: RefCallBack;
} {
    return {
        ...field,
        value: field.value ? 'true' : 'false',
        onChange: v => field.onChange(v === 'true')
    };
}
