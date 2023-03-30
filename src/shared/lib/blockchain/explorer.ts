class Explorer {
    private baseUrl = 'https://tonapi.io';

    public generateLinkToAddress(userFriendlyAddress: string): string {
        return `${this.baseUrl}/account/${userFriendlyAddress}`;
    }
}

export const explorer = new Explorer();
