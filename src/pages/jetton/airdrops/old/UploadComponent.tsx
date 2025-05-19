import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox, Flex, Input, Text } from '@chakra-ui/react';
import {
    FileInfoComponent,
    FileProcessedComponent
} from 'src/pages/jetton/airdrops/airdrop/UtilsComponents';
import { projectsStore } from 'src/shared/stores';
import { airdropApiClient } from 'src/shared/api/airdrop-api';
import { AirdropOldStore } from 'src/features/airdrop/model/airdrop-old.store';

const UploadComponentInner = (props: { id: string; airdropStore: AirdropOldStore }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [processed, setProcessed] = useState(false);
    const [isExternal, setIsExternal] = useState<boolean>(false);
    const [url, setUrl] = useState<string | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const airdropStore = props.airdropStore;
    const airdrop = airdropStore.airdrop$.value!;

    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        if (isUploading) {
            resetInterval();
        } else {
            intervalRef.current = setInterval(async () => {
                await airdropStore.loadAirdrop(props.id);
            }, 2000);
        }
        return () => resetInterval();
    }, [isUploading]);

    useEffect(() => {
        if (airdrop.upload_error) {
            setError(airdrop.upload_error);
            setProcessed(false);
        }
        if (airdrop.upload_in_progress || airdrop.file_hash) {
            setProcessed(true);
        }
    }, [airdrop]);

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        setError(null);

        await airdropApiClient.v1
            .fileUpload(
                {
                    id: props.id,
                    project_id: `${projectsStore.selectedProject!.id}`
                },
                {
                    file: file
                },
                {
                    onUploadProgress: event => {
                        if (event.total) {
                            const percentage = Math.round((event.loaded / event.total) * 100);
                            setProgress(percentage);
                        }
                    }
                }
            )
            .catch(err => {
                setError(err?.message);
            })
            .finally(async () => {
                await airdropStore.loadAirdrop(props.id);
                setIsUploading(false);
                setProgress(null);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            });
    };

    const handleUploadFromUrl = async () => {
        setIsUploading(true);
        setError(null);
        try {
            new URL(url!);
        } catch (e) {
            setError('Incorrect file URL');
        }

        await airdropApiClient.v2
            .fileUpload(
                {
                    id: props.id,
                    project_id: `${projectsStore.selectedProject!.id}`
                },
                {
                    url: url!
                }
            )
            .catch(err => {
                setError(err?.message);
            })
            .finally(async () => {
                await airdropStore.loadAirdrop(props.id);
                setIsUploading(false);
            });
    };

    const handleFileChange = async (file: File) => {
        const minSize = 1000;
        const maxSize = 1024 * 1024 * 100;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Invalid file type');
            return;
        }
        if (file.size < minSize) {
            setError('Minimum 20 wallets');
            return;
        }
        if (file.size > maxSize) {
            setError('Maximum 100 MB');
            return;
        }

        await handleFileUpload(file);
    };

    return (
        <Flex direction="column" gap="16px">
            {processed && <FileProcessedComponent />}
            {!processed && (
                <Flex direction="column" gap="24px">
                    <Flex direction="column" gap="16px">
                        <Checkbox checked={isExternal} onChange={() => setIsExternal(!isExternal)}>
                            <Text textStyle="label2">File size more than 100 MB</Text>
                        </Checkbox>
                        {isExternal ? (
                            <Flex direction="column" gap="12px">
                                <Flex align="center" direction="row" gap="12px">
                                    <Input
                                        autoComplete="off"
                                        onChange={e => setUrl(e.target.value)}
                                        placeholder="File URL"
                                        value={url || ''}
                                    />
                                    <Button
                                        flexShrink={0}
                                        isDisabled={!url}
                                        isLoading={isUploading}
                                        onClick={handleUploadFromUrl}
                                    >
                                        Upload File
                                    </Button>
                                </Flex>
                                {!!error && (
                                    <Text textStyle="body2" color="#F53C36">
                                        {error}
                                    </Text>
                                )}
                            </Flex>
                        ) : (
                            <>
                                <Flex align="center" direction="row" gap="12px">
                                    <Button
                                        flexShrink={0}
                                        isLoading={isUploading}
                                        onClick={() => {
                                            setError(null);
                                            inputRef.current!.click();
                                        }}
                                    >
                                        Upload File
                                    </Button>
                                    {!!progress && (
                                        <Flex direction="column" flex={1} gap="4px">
                                            <Flex
                                                flex={1}
                                                overflow="hidden"
                                                h="8px"
                                                minH="8px"
                                                borderRadius="8px"
                                                bgColor="background.contentTint"
                                            >
                                                <Flex w={`${progress}%`} h="8px" bgColor="#000" />
                                            </Flex>
                                            <Text textStyle="body3" color="text.secondary">
                                                {progress}% of the file uploaded
                                            </Text>
                                        </Flex>
                                    )}
                                    {!progress && !!error && (
                                        <Text textStyle="body2" color="#F53C36">
                                            {error}
                                        </Text>
                                    )}
                                </Flex>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept=".csv"
                                    style={{ display: 'none' }}
                                    onChange={e => {
                                        if (!!e.target.files?.length) {
                                            handleFileChange(e.target.files[0]);
                                        }
                                    }}
                                />
                            </>
                        )}
                    </Flex>
                    <FileInfoComponent />
                </Flex>
            )}
        </Flex>
    );
};

export const UploadComponent = observer(UploadComponentInner);
