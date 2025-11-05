import { FC } from 'react';
import { Alert, AlertDescription, AlertTitle, Flex, Link, Box } from '@chakra-ui/react';

interface UnavailableFeatureProps {
  title: string;
  message: string;
  docLink?: string;
}

/**
 * Generic component for displaying unavailable/maintenance feature messages
 * Used as a gate between router and feature pages
 */
export const UnavailableFeature: FC<UnavailableFeatureProps> = ({
  title,
  message,
  docLink
}) => {
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
            {title}
          </AlertTitle>
          <AlertDescription maxW="512px" color="text.secondary" fontSize="sm">
            {message}
          </AlertDescription>
          {docLink && (
            <Box mt="4">
              <Link
                color="accent.blue"
                fontWeight="600"
                href={docLink}
                isExternal
              >
                View Documentation
              </Link>
            </Box>
          )}
        </Alert>
      </Flex>
    </Flex>
  );
};
