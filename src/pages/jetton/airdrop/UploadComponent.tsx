import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Flex, Text } from '@chakra-ui/react';
import {
    FileInfoComponent,
    FileProcessedComponent
} from 'src/pages/jetton/airdrop/UtilsComponents';
import { airdropsStore } from 'src/features';
import { airdropApiClient } from 'src/shared/api/airdrop-api';
import { projectsStore } from 'src/entities';

const UploadComponentInner = (props: { queryId: string }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [processed, setProcessed] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const airdrop = airdropsStore.airdrop$.value!;

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
                await airdropsStore.loadAirdrop(props.queryId);
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
                    id: props.queryId,
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
            .finally(async () => {
                await airdropsStore.loadAirdrop(props.queryId);
                setIsUploading(false);
                setProgress(null);
                setError(null);
            });
    };

    const handleFileChange = async (file: File) => {
        const minSize = 1024 * 1.5;
        const maxSize = 1024 * 1024 * 500;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Invalid file type');
            return;
        }
        if (file.size < minSize) {
            setError('Minimum 20 wallets');
            return;
        }
        if (file.size > maxSize) {
            setError('Maximum 500 MB');
            return;
        }

        await handleFileUpload(file);
    };

    return (
        <Flex direction="column">
            {processed && <FileProcessedComponent />}
            {!processed && (
                <Flex direction="column" gap="24px">
                    <Flex align="center" direction="row" gap="12px">
                        <Button
                            isLoading={isUploading}
                            onClick={() => {
                                if (inputRef.current) {
                                    setError(null);
                                    inputRef.current.value = '';
                                    inputRef.current.click();
                                }
                            }}
                        >
                            Upload File
                        </Button>
                        {!!progress && (
                            <Flex
                                flex={1}
                                overflow="hidden"
                                h="8px"
                                borderRadius="8px"
                                bgColor="#f1f3f5"
                            >
                                <Flex w={`${progress}%`} h="100%" bgColor="#000" />
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
                    <FileInfoComponent />
                </Flex>
            )}
        </Flex>
    );
};

export const UploadComponent = observer(UploadComponentInner);
