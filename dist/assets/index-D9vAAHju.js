import{aa as L,r as v,j as e,aB as j,aC as m,aD as k,aE as C,aG as S,T as c,aH as f,b as y,bP as B,F as p,aN as h,E as u,l as x,C as w,Y as P,O as _,k as I,bm as E,Q as M,bl as A,d as O,bQ as N}from"./index-qsdcxri1.js";import{a as g,e as X,f as b}from"./queries-C5eI9sqV.js";import{a as T}from"./queries-B78WzP6V.js";import{a as D,P as F}from"./PeriodSelector-DoubT1yT.js";import{E as R}from"./index-CpDyD9f0.js";import"./time-periods-DmMXWjVD.js";const z=({isOpen:t,onClose:n})=>{const{colors:r}=L(),[i,d]=v.useState("last_6h"),{data:s}=T(i),{data:a}=g(),o=s?.requests||[],l=s?.connections||[];return e.jsx(D,{isOpen:t,onClose:n,title:"Liteservers Statistics",headerExtra:e.jsx(F,{value:i,onChange:d}),period:i,charts:[{title:"Liteservers Requests",data:o,color:r.accent.blue,limit:a?.rps,limitLabel:"Limit"},{title:"Liteservers Connections",data:l,color:r.accent.green}]})},q=t=>{const{mutate:n,isPending:r}=X(),i=()=>n(void 0,{onSuccess:t.onClose});return e.jsxs(j,{scrollBehavior:"inside",...t,size:"sm",children:[e.jsx(m,{}),e.jsxs(k,{children:[e.jsx(C,{children:"Create Liteserver?"}),e.jsx(S,{py:0,children:e.jsx(c,{textStyle:"body2",color:"text.secondary",children:"Will be created a two Liteserver nodes on free tier with 0.1 RPS. You can change the tier later."})}),e.jsxs(f,{gap:"3",children:[e.jsx(y,{flex:1,onClick:t.onClose,variant:"secondary",children:"Cancel"}),e.jsx(y,{flex:1,isLoading:r,onClick:i,type:"submit",variant:"primary",children:"Create"})]})]})]})},K=t=>`{
  "@type": "config.global",
  "dht": {
    "@type": "dht.config.global",
    "k": 6,
    "a": 3,
    "static_nodes": {
      "@type": "dht.nodes",
      "nodes": [
        {
            "@type": "dht.node",
            "id": {
                "@type": "pub.ed25519",
                "key": "6PGkPQSbyFp12esf1NqmDOaLoFA8i9+Mp5+cAx5wtTU="
            },
            "addr_list": {
                "@type": "adnl.addressList",
                "addrs": [
                    {
                        "@type": "adnl.address.udp",
                        "ip": -1185526007,
                        "port": 22096
                    }
                ],
                "version": 0,
                "reinit_date": 0,
                "priority": 0,
                "expire_at": 0
            },
            "version": -1,
            "signature": "L4N1+dzXLlkmT5iPnvsmsixzXU0L6kPKApqMdcrGP5d9ssMhn69SzHFK+yIzvG6zQ9oRb4TnqPBaKShjjj2OBg=="
        },
        {
          "@type": "dht.node",
          "id": {
            "@type": "pub.ed25519",
            "key": "4R0C/zU56k+x2HGMsLWjX2rP/SpoTPIHSSAmidGlsb8="
          },
          "addr_list": {
            "@type": "adnl.addressList",
            "addrs": [
              {
                "@type": "adnl.address.udp",
                "ip": -1952265919,
                "port": 14395
              }
            ],
            "version": 0,
            "reinit_date": 0,
            "priority": 0,
            "expire_at": 0
          },
          "version": -1,
          "signature": "0uwWyCFn2KjPnnlbSFYXLZdwIakaSgI9WyRo87J3iCGwb5TvJSztgA224A9kNAXeutOrXMIPYv1b8Zt8ImsrCg=="
        },
        {
          "@type": "dht.node",
          "id": {
            "@type": "pub.ed25519",
            "key": "/YDNd+IwRUgL0mq21oC0L3RxrS8gTu0nciSPUrhqR78="
          },
          "addr_list": {
            "@type": "adnl.addressList",
            "addrs": [
              {
                "@type": "adnl.address.udp",
                "ip": -1402455171,
                "port": 14432
              }
            ],
            "version": 0,
            "reinit_date": 0,
            "priority": 0,
            "expire_at": 0
          },
          "version": -1,
          "signature": "6+oVk6HDtIFbwYi9khCc8B+fTFceBUo1PWZDVTkb4l84tscvr5QpzAkdK7sS5xGzxM7V7YYQ6gUQPrsP9xcLAw=="
        },
        {
          "@type": "dht.node",
          "id": {
            "@type": "pub.ed25519",
            "key": "DA0H568bb+LoO2LGY80PgPee59jTPCqqSJJzt1SH+KE="
          },
          "addr_list": {
            "@type": "adnl.addressList",
            "addrs": [
              {
                "@type": "adnl.address.udp",
                "ip": -1402397332,
                "port": 14583
              }
            ],
            "version": 0,
            "reinit_date": 0,
            "priority": 0,
            "expire_at": 0
          },
          "version": -1,
          "signature": "cL79gDTrixhaM9AlkCdZWccCts7ieQYQBmPxb/R7d7zHw3bEHL8Le96CFJoB1KHu8C85iDpFK8qlrGl1Yt/ZDg=="
        },
        {
          "@type": "dht.node",
          "id": {
            "@type": "pub.ed25519",
            "key": "MJr8xja0xpu9DoisFXBrkNHNx1XozR7HHw9fJdSyEdo="
          },
          "addr_list": {
            "@type": "adnl.addressList",
            "addrs": [
              {
                "@type": "adnl.address.udp",
                "ip": -2018147130,
                "port": 6302
              }
            ],
            "version": 0,
            "reinit_date": 0,
            "priority": 0,
            "expire_at": 0
          },
          "version": -1,
          "signature": "XcR5JaWcf4QMdI8urLSc1zwv5+9nCuItSE1EDa0dSwYF15R/BtJoKU5YHA4/T8SiO18aVPQk2SL1pbhevuMrAQ=="
        },
        {
          "@type": "dht.node",
          "id": {
            "@type": "pub.ed25519",
            "key": "Fhldu4zlnb20/TUj9TXElZkiEmbndIiE/DXrbGKu+0c="
          },
          "addr_list": {
            "@type": "adnl.addressList",
            "addrs": [
              {
                "@type": "adnl.address.udp",
                "ip": -2018147075,
                "port": 6302
              }
            ],
            "version": 0,
            "reinit_date": 0,
            "priority": 0,
            "expire_at": 0
          },
          "version": -1,
          "signature": "nUGB77UAkd2+ZAL5PgInb3TvtuLLXJEJ2icjAUKLv4qIGB3c/O9k/v0NKwSzhsMP0ljeTGbcIoMDw24qf3goCg=="
        },
		{
		  "@type": "dht.node",
		  "id": {
		    "@type": "pub.ed25519",
		    "key": "gzUNJnBJhdpooYCE8juKZo2y4tYDIQfoCvFm0yBr7y0="
		  },
		  "addr_list": {
		    "@type": "adnl.addressList",
		    "addrs": [
		      {
		        "@type": "adnl.address.udp",
		        "ip": 89013260,
		        "port": 54390
		      }
		    ],
		    "version": 0,
		    "reinit_date": 0,
		    "priority": 0,
		    "expire_at": 0
		  },
		  "version": -1,
		  "signature": "LCrCkjmkMn6AZHW2I+oRm1gHK7CyBPfcb6LwsltskCPpNECyBl1GxZTX45n0xZtLgyBd/bOqMPBfawpQwWt1BA=="
		},
		{
		  "@type": "dht.node",
		  "id": {
		    "@type": "pub.ed25519",
		    "key": "jXiLaOQz1HPayilWgBWhV9xJhUIqfU95t+KFKQPIpXg="
		  },
		  "addr_list": {
		    "@type": "adnl.addressList",
		    "addrs": [
		      {
		        "@type": "adnl.address.udp",
		        "ip": 94452896,
		        "port": 12485
		      }
		    ],
		    "version": 0,
		    "reinit_date": 0,
		    "priority": 0,
		    "expire_at": 0
		  },
		  "version": -1,
		  "signature": "fKSZh9nXMx+YblkQXn3I/bndTD0JZ1yAtK/tXPIGruNglpe9sWMXR+8fy3YogPhLJMdjNiMom1ya+tWG7qvBAQ=="
		},
		{
		  "@type": "dht.node",
		  "id": {
		    "@type": "pub.ed25519",
		    "key": "vhFPq+tgjJi+4ZbEOHBo4qjpqhBdSCzNZBdgXyj3NK8="
		  },
		  "addr_list": {
		    "@type": "adnl.addressList",
		    "addrs": [
		      {
		        "@type": "adnl.address.udp",
		        "ip": 85383775,
		        "port": 36752
		      }
		    ],
		    "version": 0,
		    "reinit_date": 0,
		    "priority": 0,
		    "expire_at": 0
		  },
		  "version": -1,
		  "signature": "kBwAIgJVkz8AIOGoZcZcXWgNmWq8MSBWB2VhS8Pd+f9LLPIeeFxlDTtwAe8Kj7NkHDSDC+bPXLGQZvPv0+wHCg=="
		},
		{
		  "@type": "dht.node",
		  "id": {
		    "@type": "pub.ed25519",
		    "key": "sbsuMcdyYFSRQ0sG86/n+ZQ5FX3zOWm1aCVuHwXdgs0="
		  },
		  "addr_list": {
		    "@type": "adnl.addressList",
		    "addrs": [
		      {
		        "@type": "adnl.address.udp",
		        "ip": 759132846,
		        "port": 50187
		      }
		    ],
		    "version": 0,
		    "reinit_date": 0,
		    "priority": 0,
		    "expire_at": 0
		  },
		  "version": -1,
		  "signature": "9FJwbFw3IECRFkb9bA54YaexjDmlNBArimWkh+BvW88mjm3K2i5V2uaBPS3GubvXWOwdHLE2lzQBobgZRGMyCg=="
		},
		{
		  "@type": "dht.node",
		  "id": {
		    "@type": "pub.ed25519",
		    "key": "aeMgdMdkkbkfAS4+n4BEGgtqhkf2/zXrVWWECOJ/h3A="
		  },
		  "addr_list": {
		    "@type": "adnl.addressList",
		    "addrs": [
		      {
		        "@type": "adnl.address.udp",
		        "ip": -1481887565,
		        "port": 25975
		      }
		    ],
		    "version": 0,
		    "reinit_date": 0,
		    "priority": 0,
		    "expire_at": 0
		  },
		  "version": -1,
		  "signature": "z5ogivZWpQchkS4UR4wB7i2pfOpMwX9Nd/USxinL9LvJPa+/Aw3F1AytR9FX0BqDftxIYvblBYAB5JyAmlj+AA=="
		},
		{
		  "@type": "dht.node",
		  "id": {
		    "@type": "pub.ed25519",
		    "key": "rNzhnAlmtRn9rTzW6o2568S6bbOXly7ddO1olDws5wM="
		  },
		  "addr_list": {
		    "@type": "adnl.addressList",
		    "addrs": [
		      {
		        "@type": "adnl.address.udp",
		        "ip": -2134428422,
		        "port": 45943
		      }
		    ],
		    "version": 0,
		    "reinit_date": 0,
		    "priority": 0,
		    "expire_at": 0
		  },
		  "version": -1,
		  "signature": "sn/+ZfkfCSw2bHnEnv04AXX/Goyw7+StHBPQOdPr+wvdbaJ761D7hyiMNdQGbuZv2Ep2cXJpiwylnZItrwdUDg=="
		}
      ]
    }
  },
  "liteservers": ${t},
  "validator": {
    "@type": "validator.config.global",
    "zero_state": {
      "workchain": -1,
      "shard": -9223372036854775808,
      "seqno": 0,
      "root_hash": "F6OpKZKqvqeFp6CQmFomXNMfMj2EnaUSOXN+Mh+wVWk=",
      "file_hash": "XplPz01CXAps5qeSWUtxcyBfdAo5zVb1N979KLSKD24="
    },
    "init_block": {
      "root_hash": "VpWyfNOLm8Rqt6CZZ9dZGqJRO3NyrlHHYN1k1oLbJ6g=",
      "seqno": 34835953,
      "file_hash": "8o12KX54BtJM8RERD1J97Qe1ZWk61LIIyXydlBnixK8=",
      "workchain": -1,
      "shard": -9223372036854775808
    },
    "hardforks": [
      {
        "file_hash": "t/9VBPODF7Zdh4nsnA49dprO69nQNMqYL+zk5bCjV/8=",
        "seqno": 8536841,
        "root_hash": "08Kpc9XxrMKC6BF/FeNHPS3MEL1/Vi/fQU/C9ELUrkc=",
        "workchain": -1,
        "shard": -9223372036854775808
      }
    ]
  }
}`,Z=({liteproxyList:t})=>{const n=d=>{const s=d.split(".").map(Number);if(s.length!==4||s.some(l=>l<0||l>255||isNaN(l)))throw new Error("Invalid IP address");const a=BigInt(s[0])<<24n|BigInt(s[1])<<16n|BigInt(s[2])<<8n|BigInt(s[3]),o=BigInt.asIntN(32,a);return Number(o)},r=()=>{const d=t.map(({server:s,public_key:a})=>({ip:n(s.split(":")[0]),port:parseInt(s.split(":")[1]),id:{"@type":"pub.ed25519",key:a}}));return K(JSON.stringify(d,null,2))},i=()=>{const d=r(),s=new Blob([d],{type:"application/json"}),a=URL.createObjectURL(s),o=document.createElement("a");o.href=a,o.download="global.config.json",o.click(),URL.revokeObjectURL(a)};return e.jsx(y,{leftIcon:e.jsx(B,{}),onClick:i,variant:"secondary",children:"Download global.config"})},H=({onStatisticsClick:t})=>{const{data:n=[]}=b();return e.jsxs(e.Fragment,{children:[n.map((r,i)=>e.jsxs(p,{direction:"column",gap:1,mb:4,children:[e.jsxs(c,{textStyle:"text.label1",fontWeight:600,children:["Server #",i+1]}),e.jsxs(p,{align:"baseline",gap:2,children:[e.jsx(c,{textStyle:"text.label2",children:"Server:"}),e.jsx(h,{text:r.server,variant:"flat",width:"190px"})]}),e.jsxs(p,{align:"baseline",gap:2,children:[e.jsx(c,{textStyle:"text.label2",children:"Public key:"}),e.jsx(h,{text:r.public_key,variant:"flat",width:"407px"})]})]},r.server)),e.jsxs(p,{gap:2,mt:4,children:[e.jsx(Z,{liteproxyList:n}),t&&e.jsx(y,{onClick:t,variant:"secondary",children:"Statistics"})]})]})},J=({onOpenCreate:t})=>e.jsxs(R,{title:"Liteservers",mainButtonAction:t,mainButtonText:"Create Liteserver",guideButtonLink:u.DOCUMENTATION_LITESERVERS,isBeta:!0,children:[e.jsx(c,{textStyle:"body2",children:"The LiteServers service allows you to create and gain direct access to LiteServers in the TON network."}),e.jsx(c,{textStyle:"body2",mt:4,children:"Enjoy seamless access to TON blockchain data without the complexity and overhead of full synchronization on your infrastructure."})]}),ee=()=>{const{isOpen:t,onOpen:n,onClose:r}=x(),{isOpen:i,onOpen:d,onClose:s}=x(),{data:a=[],isLoading:o}=b(),{data:l}=g();return o?e.jsx(w,{h:"300px",children:e.jsx(P,{})}):a.length===0?e.jsxs(e.Fragment,{children:[e.jsx(J,{onOpenCreate:n}),";",e.jsx(q,{isOpen:t,onClose:r})]}):e.jsxs(e.Fragment,{children:[e.jsxs(_,{h:"fit-content",children:[e.jsxs(p,{gap:4,mb:"4",children:[e.jsxs(p,{direction:"column",gap:2,children:[e.jsxs(p,{align:"center",gap:4,children:[e.jsx(I,{children:"Liteservers"}),e.jsx(E,{textStyle:"label3",color:"accent.orange",fontFamily:"body",bgColor:"color-mix(in srgb, currentColor 12%, transparent)",children:"BETA"})]}),e.jsxs(p,{align:"baseline",gap:2,children:[e.jsxs(c,{textStyle:"text.body2",color:"text.secondary",fontSize:14,children:["Your current plan:"," ",l?`${l.name} (${l.rps} RPS)`:"..."]}),e.jsx(M,{as:A,ml:"auto",color:"accent.blue",to:"./pricing",children:"Change"})]})]}),e.jsx(O,{ml:"auto",leftIcon:e.jsx(N,{w:"20px",h:"20px"}),size:"md",height:"100%",variant:"secondary",href:u.DOCUMENTATION_LITESERVERS,isExternal:!0,children:"Liteservers Doc"})]}),e.jsx(H,{onStatisticsClick:d})]}),e.jsx(z,{isOpen:i,onClose:s})]})};export{ee as default};
