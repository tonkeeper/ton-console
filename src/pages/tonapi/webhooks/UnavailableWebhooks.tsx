import { FC } from 'react';
import { EXTERNAL_LINKS } from 'src/shared';
import { Alert, AlertDescription, AlertTitle, Flex, Link, Box } from '@chakra-ui/react';

/**
 * Component shown when webhooks playground is unavailable (501 error)
 */
export const UnavailableWebhooks: FC = () => {
  return (
    <Flex align="center" justify="center" minH="300px">
      <Flex align="center" direction="column" maxW="512px">
        <Alert
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          gap="4"
          p="8"
          textAlign="center"
          bg="background.contentTint"
          borderColor="separator.common"
          borderRadius="md"
          status="info"
          variant="subtle"
        >
          <AlertTitle pt="2" color="text.primary" fontSize="lg" fontWeight="bold">
            Webhooks playground is temporarily unavailable
          </AlertTitle>
          <AlertDescription maxW="512px" color="text.secondary" fontSize="sm">
            The webhooks playground is not available at the moment. However, you can manage webhooks through the API.
          </AlertDescription>
          <Box mt="4">
            <Link
              color="accent.blue"
              fontWeight="600"
              href={EXTERNAL_LINKS.DOCUMENTATION_WEBHOOKS}
              isExternal
            >
              View Webhooks API Documentation
            </Link>
          </Box>
        </Alert>
      </Flex>
    </Flex>
  );
};
