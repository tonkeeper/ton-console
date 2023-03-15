import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

const ApiKeysPage: FunctionComponent = () => {
    const { keyId } = useParams();
    return <div>Key {keyId}</div>;
};

export default ApiKeysPage;
