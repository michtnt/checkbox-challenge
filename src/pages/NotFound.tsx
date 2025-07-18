import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Flex, Heading, Text, Link } from '@radix-ui/themes';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <Flex minHeight="100vh" align="center" justify="center" style={{ backgroundColor: '#f8f9fa' }}>
      <Flex direction="column" align="center" gap="4">
        <Heading size="8" weight="bold">
          404
        </Heading>
        <Text size="5" color="gray">
          Oops! Page not found
        </Text>
        <Link href="/" color="blue" style={{ textDecoration: 'underline' }}>
          Return to Home
        </Link>
      </Flex>
    </Flex>
  );
};

export default NotFound;
