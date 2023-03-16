const defaultProps = {
    isCentered: true,
    size: 'lg'
} as unknown as
    | {
          size?: 'lg' | 'md' | undefined;
          variant?: string | number | undefined;
          colorScheme?: string | undefined;
      }
    | undefined;

export default defaultProps;
