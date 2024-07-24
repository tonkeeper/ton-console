import { Site } from '../sites.store';

function generateRandomHash(length = 64) {
    const characters = 'abcdef0123456789';
    let hash = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        hash += characters[randomIndex];
    }
    return hash;
}

const mockSites: Site[] = [
    {
        id: 1,
        domain: 'mois.ton',
        adnl_address: generateRandomHash(),
        endpoints: ['https://mois.pro', 'http://145:234:78:12/']
    },
    {
        id: 2,
        domain: 'google.ton',
        adnl_address: generateRandomHash(),
        endpoints: ['https://google.com', 'lol.google']
    }
];

export const mockLoaders = {
    getSites: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockSites;
    },
    addSite: ({ domain }: { domain: string }) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (mockSites.some(site => site.domain === domain)) {
                    reject(new Error('Domain already exists'));
                } else {
                    const maxId = Math.max(...mockSites.map(site => site.id));
                    const newSite = {
                        id: maxId + 1,
                        domain,
                        adnl_address: generateRandomHash(),
                        endpoints: []
                    };
                    mockSites.push(newSite);
                    resolve(newSite);
                }
            }, 500);
        });
    },
    deleteSite: (id: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const siteIndex = mockSites.findIndex(site => site.id === id);
                if (siteIndex === -1) {
                    reject(new Error('Site not found'));
                } else {
                    mockSites.splice(siteIndex, 1);
                    resolve();
                }
            }, 500);
        });
    }
};
