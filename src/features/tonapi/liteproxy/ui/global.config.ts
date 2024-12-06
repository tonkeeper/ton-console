export type Liteserver = {
    ip: number;
    port: number;
    id: {
        '@type': 'pub.ed25519';
        key: string;
    };
};

export const globalConfig = {
    '@type': 'config.global',
    dht: {
        '@type': 'dht.config.global',
        k: 6,
        a: 3,
        static_nodes: {
            '@type': 'dht.nodes',
            nodes: [
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: '6PGkPQSbyFp12esf1NqmDOaLoFA8i9+Mp5+cAx5wtTU='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: -1185526007,
                                port: 22096
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        'L4N1+dzXLlkmT5iPnvsmsixzXU0L6kPKApqMdcrGP5d9ssMhn69SzHFK+yIzvG6zQ9oRb4TnqPBaKShjjj2OBg=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: '4R0C/zU56k+x2HGMsLWjX2rP/SpoTPIHSSAmidGlsb8='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: -1952265919,
                                port: 14395
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        '0uwWyCFn2KjPnnlbSFYXLZdwIakaSgI9WyRo87J3iCGwb5TvJSztgA224A9kNAXeutOrXMIPYv1b8Zt8ImsrCg=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: '/YDNd+IwRUgL0mq21oC0L3RxrS8gTu0nciSPUrhqR78='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: -1402455171,
                                port: 14432
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        '6+oVk6HDtIFbwYi9khCc8B+fTFceBUo1PWZDVTkb4l84tscvr5QpzAkdK7sS5xGzxM7V7YYQ6gUQPrsP9xcLAw=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: 'DA0H568bb+LoO2LGY80PgPee59jTPCqqSJJzt1SH+KE='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: -1402397332,
                                port: 14583
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        'cL79gDTrixhaM9AlkCdZWccCts7ieQYQBmPxb/R7d7zHw3bEHL8Le96CFJoB1KHu8C85iDpFK8qlrGl1Yt/ZDg=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: 'MJr8xja0xpu9DoisFXBrkNHNx1XozR7HHw9fJdSyEdo='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: -2018147130,
                                port: 6302
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        'XcR5JaWcf4QMdI8urLSc1zwv5+9nCuItSE1EDa0dSwYF15R/BtJoKU5YHA4/T8SiO18aVPQk2SL1pbhevuMrAQ=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: 'Fhldu4zlnb20/TUj9TXElZkiEmbndIiE/DXrbGKu+0c='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: -2018147075,
                                port: 6302
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        'nUGB77UAkd2+ZAL5PgInb3TvtuLLXJEJ2icjAUKLv4qIGB3c/O9k/v0NKwSzhsMP0ljeTGbcIoMDw24qf3goCg=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: 'gzUNJnBJhdpooYCE8juKZo2y4tYDIQfoCvFm0yBr7y0='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: 89013260,
                                port: 54390
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        'LCrCkjmkMn6AZHW2I+oRm1gHK7CyBPfcb6LwsltskCPpNECyBl1GxZTX45n0xZtLgyBd/bOqMPBfawpQwWt1BA=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: 'jXiLaOQz1HPayilWgBWhV9xJhUIqfU95t+KFKQPIpXg='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: 94452896,
                                port: 12485
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        'fKSZh9nXMx+YblkQXn3I/bndTD0JZ1yAtK/tXPIGruNglpe9sWMXR+8fy3YogPhLJMdjNiMom1ya+tWG7qvBAQ=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: 'vhFPq+tgjJi+4ZbEOHBo4qjpqhBdSCzNZBdgXyj3NK8='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: 85383775,
                                port: 36752
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        'kBwAIgJVkz8AIOGoZcZcXWgNmWq8MSBWB2VhS8Pd+f9LLPIeeFxlDTtwAe8Kj7NkHDSDC+bPXLGQZvPv0+wHCg=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: 'sbsuMcdyYFSRQ0sG86/n+ZQ5FX3zOWm1aCVuHwXdgs0='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: 759132846,
                                port: 50187
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        '9FJwbFw3IECRFkb9bA54YaexjDmlNBArimWkh+BvW88mjm3K2i5V2uaBPS3GubvXWOwdHLE2lzQBobgZRGMyCg=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: 'aeMgdMdkkbkfAS4+n4BEGgtqhkf2/zXrVWWECOJ/h3A='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: -1481887565,
                                port: 25975
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        'z5ogivZWpQchkS4UR4wB7i2pfOpMwX9Nd/USxinL9LvJPa+/Aw3F1AytR9FX0BqDftxIYvblBYAB5JyAmlj+AA=='
                },
                {
                    '@type': 'dht.node',
                    id: {
                        '@type': 'pub.ed25519',
                        key: 'rNzhnAlmtRn9rTzW6o2568S6bbOXly7ddO1olDws5wM='
                    },
                    addr_list: {
                        '@type': 'adnl.addressList',
                        addrs: [
                            {
                                '@type': 'adnl.address.udp',
                                ip: -2134428422,
                                port: 45943
                            }
                        ],
                        version: 0,
                        reinit_date: 0,
                        priority: 0,
                        expire_at: 0
                    },
                    version: -1,
                    signature:
                        'sn/+ZfkfCSw2bHnEnv04AXX/Goyw7+StHBPQOdPr+wvdbaJ761D7hyiMNdQGbuZv2Ep2cXJpiwylnZItrwdUDg=='
                }
            ]
        }
    },
    liteservers: [] as Liteserver[],
    validator: {
        '@type': 'validator.config.global',
        zero_state: {
            workchain: -1,
            shard: -9223372036854775808,
            seqno: 0,
            root_hash: 'F6OpKZKqvqeFp6CQmFomXNMfMj2EnaUSOXN+Mh+wVWk=',
            file_hash: 'XplPz01CXAps5qeSWUtxcyBfdAo5zVb1N979KLSKD24='
        },
        init_block: {
            root_hash: 'VpWyfNOLm8Rqt6CZZ9dZGqJRO3NyrlHHYN1k1oLbJ6g=',
            seqno: 34835953,
            file_hash: '8o12KX54BtJM8RERD1J97Qe1ZWk61LIIyXydlBnixK8=',
            workchain: -1,
            shard: -9223372036854775808
        },
        hardforks: [
            {
                file_hash: 't/9VBPODF7Zdh4nsnA49dprO69nQNMqYL+zk5bCjV/8=',
                seqno: 8536841,
                root_hash: '08Kpc9XxrMKC6BF/FeNHPS3MEL1/Vi/fQU/C9ELUrkc=',
                workchain: -1,
                shard: -9223372036854775808
            }
        ]
    }
};
