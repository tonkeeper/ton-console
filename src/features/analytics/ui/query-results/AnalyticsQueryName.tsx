import {
    useEditableControls,
    ButtonGroup,
    Button,
    Flex,
    Editable,
    EditablePreview,
    Input,
    EditableInput
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { DoneIcon16, CloseIcon24, EditIcon24 } from 'src/shared';

export const EditNameControl: FC<{
    onChangeName: (name: string) => void;
    defaultName?: string;
}> = ({ onChangeName, defaultName }) => {
    const [name, setName] = useState(defaultName);

    const handleChageName = () => {
        onChangeName(name ?? '');
    };

    function EditableControls() {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
            useEditableControls();

        return isEditing ? (
            <ButtonGroup justifyContent="center" ml="2" size="sm">
                <Button
                    color="text.secondary"
                    _hover={{ color: 'text.primary' }}
                    aria-label="Approve"
                    variant="unstyled"
                    {...getSubmitButtonProps()}
                >
                    <DoneIcon16 h="24px" w="24px" />
                </Button>
                <Button
                    color="text.secondary"
                    _hover={{ color: 'text.primary' }}
                    aria-label="Cancel"
                    variant="unstyled"
                    {...getCancelButtonProps()}
                >
                    <CloseIcon24 />
                </Button>
            </ButtonGroup>
        ) : (
            <Flex justify="center" ml="2">
                <Button
                    color="text.secondary"
                    _hover={{ color: 'text.primary' }}
                    variant="unstyled"
                    {...getEditButtonProps()}
                    aria-label="Edit"
                    size="6"
                >
                    <EditIcon24 />
                </Button>
            </Flex>
        );
    }

    return (
        <Editable
            textStyle="body2"
            alignItems={'center'}
            display="flex"
            h="100%"
            fontSize="16px"
            textAlign="center"
            defaultValue={name}
            isPreviewFocusable={false}
            onChange={setName}
            onSubmit={handleChageName}
            placeholder="Query name"
            value={name}
        >
            <EditablePreview />
            <Input as={EditableInput} h="2em" color="text.primary" />
            <EditableControls />
        </Editable>
    );
};
