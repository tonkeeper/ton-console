import { FunctionComponent } from 'react';

export interface ButtonProps {
    text: string;
}

export const Button: FunctionComponent<ButtonProps> = ({ text }) => {
    return <button>{text}</button>;
};
