import { FC } from 'react';
import { EXTERNAL_LINKS, H4 } from 'src/shared';
import { Alert, AlertDescription, AlertTitle, Flex, Text, Link, Box } from '@chakra-ui/react';

/**
 * Component shown when webhooks playground is unavailable (501 error)
 */
export const UnavailableWebhooks: FC = () => {
  return (
    <Flex align="center" justify="center" minH="300px">
      <Flex align="center" direction="column" maxW="512px">
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="md"
          p="8"
          gap="4"
          bg="background.contentTint"
          borderColor="separator.common"
        >
          <AlertTitle pt="2" fontSize="lg" fontWeight="bold" color="text.primary">
            Webhooks playground is temporarily unavailable
          </AlertTitle>
          <AlertDescription fontSize="sm" maxW="512px" color="text.secondary">
            The webhooks playground is not available at the moment. However, you can manage webhooks through the API.
          </AlertDescription>
          <Box mt="4">
            <Link
              color="accent.blue"
              href={EXTERNAL_LINKS.DOCUMENTATION_WEBHOOKS}
              isExternal
              fontWeight="600"
            >
              View Webhooks API Documentation
            </Link>
          </Box>
        </Alert>
      </Flex>
    </Flex>
  );
};
