import {
    ChangeEvent,
    ComponentProps,
    forwardRef,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { Box, Center, Flex, Text, Button, Image, Input } from '@chakra-ui/react';
import { UseFormRegisterReturn } from 'react-hook-form/dist/types/form';

const ImageInput = forwardRef<
    HTMLInputElement,
    ComponentProps<typeof Box> &
        UseFormRegisterReturn & {
            accept?: string;
            heading?: ReactNode;
            description?: ReactNode;
        }
>((props, ref) => {
    const {
        onChange,
        onBlur,
        name,
        required,
        disabled,
        accept,
        heading,
        description,
        ...boxProps
    } = props;
    const nameWithFallback = name || 'input-file';
    const acceptWithFallback = accept || 'image/*';

    const inputRef = useRef<HTMLInputElement | null>(null);
    const dropContainerRef = useRef<HTMLDivElement | null>(null);
    const [file, setFile] = useState<string | null>(null);
    const [fileList, setFileList] = useState<null | FileList>();
    const [hasError, setHasError] = useState<boolean>(false);

    const refCallback = useCallback(
        (el: HTMLInputElement | null) => {
            let proxy = null;

            if (el) {
                // react hook form limitation workaround
                // https://github.com/react-hook-form/react-hook-form/discussions/8612?sort=old
                proxy = new Proxy(el, {
                    get(target, key: keyof HTMLInputElement | 'target') {
                        if (key === 'target') {
                            return target;
                        }

                        const value = target[key];
                        if (value instanceof Function) {
                            return value.bind(target);
                        }

                        if (key === 'value') {
                            return fileList;
                        }

                        if (key === 'type') {
                            // react hook form limitation workaround
                            // react hook form will not set the default value if input has type 'file'
                            return 'text';
                        }

                        return value;
                    },
                    set(target, key: keyof HTMLInputElement, value) {
                        if (key === 'value') {
                            if (value instanceof FileList) {
                                setFile(URL.createObjectURL(value[0]));
                            } else {
                                setFile(null);
                            }
                            return true;
                        }

                        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                        //@ts-ignore
                        target[key] = value;
                        return true;
                    }
                });
            }

            if (typeof ref === 'function') {
                ref(proxy);
            } else if (ref) {
                ref.current = proxy;
            }

            inputRef.current = el;
        },
        [ref, fileList]
    );

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>): void => {
            if (e.target.files?.[0]) {
                setFileList(e.target.files);
                onChange({
                    ...e,
                    target: { ...e.target, name: nameWithFallback, value: e.target.files }
                });
                setFile(URL.createObjectURL(e.target.files![0]));
            } else {
                setFileList(null);
                setFile(null);
                onChange({
                    ...e,
                    target: { ...e.target, name: nameWithFallback, value: null }
                });
            }
        },
        [onChange, nameWithFallback]
    );

    const onReset = useCallback(() => {
        inputRef.current!.value = '';
        setFileList(null);
        setFile(null);
        onChange({ target: { ...inputRef.current, name: nameWithFallback, value: null } });
    }, [onChange]);

    useEffect(() => {
        let observer: MutationObserver;
        if (inputRef.current) {
            observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes') {
                        if (mutation.attributeName === 'aria-invalid') {
                            setHasError(!!inputRef.current?.getAttribute(mutation.attributeName));
                        }
                    }
                });
            });

            observer.observe(inputRef.current, { attributes: true });
        }
        return () => observer?.disconnect();
    }, []);

    useEffect(() => {
        if (!dropContainerRef.current || !inputRef.current) {
            return;
        }
        dropContainerRef.current.ondragover = dropContainerRef.current.ondragenter = evt =>
            evt.preventDefault();

        dropContainerRef.current.ondrop = evt => {
            if (!file) {
                inputRef.current!.files = evt.dataTransfer?.files || null;
                handleChange({ target: inputRef.current } as ChangeEvent<HTMLInputElement>);
            }
            evt.preventDefault();
        };
    }, [file, handleChange]);

    return (
        <Center
            pos="relative"
            alignItems="center"
            overflow="hidden"
            w="100%"
            h="200px"
            border={hasError ? '1px' : '0'}
            borderColor="field.errorBorder"
            borderRadius="md"
            bgColor={hasError ? 'field.errorBackground' : 'field.background'}
            {...boxProps}
            ref={dropContainerRef}
        >
            {file ? (
                <>
                    <Image
                        pos="absolute"
                        top="0"
                        right="0"
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        bgColor="rgba(0, 0, 0, 0.4)"
                        filter="blur(22px)"
                        src={file}
                    />
                    <Box
                        pos="absolute"
                        top="0"
                        right="0"
                        w="100%"
                        h="100%"
                        bgColor="background.overlay"
                    />
                    <Button pos="absolute" right="3" bottom="3" onClick={onReset} size="sm">
                        Remove
                    </Button>
                    <Image
                        zIndex="2"
                        boxSize="128px"
                        borderRadius="100"
                        objectFit="cover"
                        src={file}
                    />
                </>
            ) : (
                <Flex align="center" direction="column" maxW="400px" pt="4">
                    <Text textStyle="label2" mb="1" color="text.primary" textAlign="center">
                        {heading || 'Upload icon'}
                    </Text>
                    <Text textStyle="body2" mb="4" color="text.tertiary" textAlign="center">
                        {description || 'Upload image in JPG, GIF, or PNG format.'}
                    </Text>
                    <Button as="label" htmlFor={nameWithFallback}>
                        Upload
                    </Button>
                </Flex>
            )}
            <Input
                ref={refCallback}
                pos="absolute"
                overflow="hidden"
                w="0"
                h="0"
                opacity="0"
                accept={acceptWithFallback}
                aria-hidden="true"
                disabled={disabled}
                id={nameWithFallback}
                name={nameWithFallback}
                onBlur={onBlur}
                onChange={handleChange}
                required={required}
                type="file"
                z-index="-1"
            />
        </Center>
    );
});

ImageInput.displayName = 'ImageInput';
export { ImageInput };
