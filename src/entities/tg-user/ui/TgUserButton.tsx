import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { tGUserStore } from 'src/entities';
import { Box, Button } from '@chakra-ui/react';

export const TgUserButton: FunctionComponent = observer(() => {
    if (tGUserStore.user) {
        return <Box>name: {tGUserStore.user.firstName}</Box>;
    } else {
        return <Button onClick={tGUserStore.login}>Login</Button>;
    }
});
