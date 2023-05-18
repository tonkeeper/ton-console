import {
    ChangeEvent,
    ComponentProps,
    FunctionComponent,
    ReactElement,
    useContext,
    useState
} from 'react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { OptionsInputContext } from './context';

export const OptionsInputText: FunctionComponent<
    ComponentProps<typeof Input> & { rightElement?: ReactElement<typeof InputRightElement> }
> = ({ rightElement, ...rest }) => {
    const [value, setValue] = useState('');

    const { setInputValue, setInputType, inputType } = useContext(OptionsInputContext);

    const setInputIsText = (): void => {
        if (inputType !== 'text') {
            setInputType?.('text');
        }
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInputIsText();
        const actual = e.target.value;
        setValue(actual);
        setInputValue?.(actual);
    };

    const InputElement = (
        <Input
            color={inputType === 'text' ? 'text.primary' : 'text.secondary'}
            {...(inputType === 'text' && {
                borderColor: 'text.primary',
                _focus: {
                    borderColor: 'text.primary'
                }
            })}
            autoComplete="off"
            onChange={handleChange}
            onFocus={setInputIsText}
            value={value}
            {...rest}
        />
    );

    if (rightElement) {
        return (
            <InputGroup>
                <>
                    {InputElement}
                    {!!value && rightElement}
                </>
            </InputGroup>
        );
    }

    return InputElement;
};
