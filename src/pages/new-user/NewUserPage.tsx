import { FunctionComponent } from 'react';
import { H4, Overlay } from 'src/shared';

const NewUserPage: FunctionComponent = () => {
    return (
        <Overlay display="flex" alignItems="center" justifyContent="center">
            <H4>Please authorize to continue</H4>
        </Overlay>
    );
};

export default NewUserPage;
