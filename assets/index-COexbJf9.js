import{j as e,ay as y,az as h,aA as u,aB as g,aC as m,aD as j,C as L,V as I,T as a,F as o,B as v,ap as S,aq as k,at as f,au as C,av as B,as as w,b4 as E,b,cd as N,ba as A,E as _,l as M,O as F,k as O,bN as X,N as z,bM as T,d as D,ce as R}from"./index--6gyeIm1.js";import{e as K,f as P,a as q}from"./queries-Dkadx4GS.js";import{a as Z}from"./queries-Bk5JuKYX.js";import{E as J}from"./index-C7MYgz_t.js";import"./time-periods-B2gFC1G6.js";const x=t=>{const s=new Date(t);return`${s.toLocaleDateString()} ${s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`},W=({isOpen:t,onClose:s})=>{const{data:i,isLoading:d}=Z();return d?e.jsxs(y,{isOpen:t,onClose:s,size:"4xl",children:[e.jsx(h,{}),e.jsxs(u,{children:[e.jsx(g,{children:"Liteservers Statistics"}),e.jsx(m,{}),e.jsx(j,{children:e.jsx(L,{h:"400px",children:e.jsx(I,{})})})]})]}):i?e.jsxs(y,{isOpen:t,onClose:s,size:"4xl",children:[e.jsx(h,{}),e.jsxs(u,{children:[e.jsx(g,{children:"Liteservers Statistics"}),e.jsx(m,{}),e.jsx(j,{pb:4,children:e.jsxs(o,{direction:"column",gap:8,children:[e.jsx(a,{textStyle:"text.label1",mb:1,color:"text.secondary",fontSize:16,children:"Liteservers Requests"}),e.jsx(v,{h:250,children:e.jsx(S,{height:"100%",children:e.jsxs(k,{data:i.requests,margin:{top:0,right:0,bottom:0,left:0},children:[e.jsx(f,{dataKey:"time",type:"number",domain:["dataMin","dataMax"],tickFormatter:x}),e.jsx(C,{}),e.jsx(B,{labelFormatter:n=>x(Number(n))}),e.jsx(w,{type:"monotone",dataKey:"value",stroke:"#2E84E5",dot:!1,isAnimationActive:!1})]})})}),e.jsx(a,{textStyle:"text.label1",mb:1,color:"text.secondary",fontSize:16,children:"Liteservers Connections"}),e.jsx(v,{h:250,children:e.jsx(S,{height:"100%",children:e.jsxs(k,{data:i.connections,margin:{top:0,right:0,bottom:0,left:0},children:[e.jsx(f,{dataKey:"time",type:"number",domain:["dataMin","dataMax"],tickFormatter:x}),e.jsx(C,{}),e.jsx(B,{labelFormatter:n=>x(Number(n))}),e.jsx(w,{type:"monotone",dataKey:"value",stroke:"#52A02B",dot:!1,isAnimationActive:!1})]})})})]})})]})]}):e.jsxs(y,{isOpen:t,onClose:s,size:"4xl",children:[e.jsx(h,{}),e.jsxs(u,{children:[e.jsx(g,{children:"Liteservers Statistics"}),e.jsx(m,{}),e.jsx(j,{children:e.jsx(L,{h:"400px",children:e.jsx(a,{color:"text.secondary",children:"No data available"})})})]})]})},H=t=>{const{mutate:s,isPending:i}=K(),d=()=>s(void 0,{onSuccess:t.onClose});return e.jsxs(y,{scrollBehavior:"inside",...t,size:"sm",children:[e.jsx(h,{}),e.jsxs(u,{children:[e.jsx(g,{children:"Create Liteserver?"}),e.jsx(j,{py:0,children:e.jsx(a,{textStyle:"body2",color:"text.secondary",children:"Will be created a two Liteserver nodes on free tier with 0.1 RPS. You can change the tier later."})}),e.jsxs(E,{gap:"3",children:[e.jsx(b,{flex:1,onClick:t.onClose,variant:"secondary",children:"Cancel"}),e.jsx(b,{flex:1,isLoading:i,onClick:d,type:"submit",variant:"primary",children:"Create"})]})]})]})},U=t=>`{
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
}`,Q=({liteproxyList:t})=>{const s=n=>{const r=n.split(".").map(Number);if(r.length!==4||r.some(c=>c<0||c>255||isNaN(c)))throw new Error("Invalid IP address");const l=BigInt(r[0])<<24n|BigInt(r[1])<<16n|BigInt(r[2])<<8n|BigInt(r[3]),p=BigInt.asIntN(32,l);return Number(p)},i=()=>{const n=t.map(({server:r,public_key:l})=>({ip:s(r.split(":")[0]),port:parseInt(r.split(":")[1]),id:{"@type":"pub.ed25519",key:l}}));return U(JSON.stringify(n,null,2))},d=()=>{const n=i(),r=new Blob([n],{type:"application/json"}),l=URL.createObjectURL(r),p=document.createElement("a");p.href=l,p.download="global.config.json",p.click(),URL.revokeObjectURL(l)};return e.jsx(b,{leftIcon:e.jsx(N,{}),onClick:d,variant:"secondary",children:"Download global.config"})},G=({onStatisticsClick:t})=>{const{data:s=[]}=P();return e.jsxs(e.Fragment,{children:[s.map((i,d)=>e.jsxs(o,{direction:"column",gap:1,mb:4,children:[e.jsxs(a,{textStyle:"text.label1",fontWeight:600,children:["Server #",d+1]}),e.jsxs(o,{align:"baseline",gap:2,children:[e.jsx(a,{textStyle:"text.label2",children:"Server:"}),e.jsx(A,{text:i.server,variant:"flat",width:"190px"})]}),e.jsxs(o,{align:"baseline",gap:2,children:[e.jsx(a,{textStyle:"text.label2",children:"Public key:"}),e.jsx(A,{text:i.public_key,variant:"flat",width:"407px"})]})]},i.server)),e.jsxs(o,{gap:2,mt:4,children:[e.jsx(Q,{liteproxyList:s}),t&&e.jsx(b,{onClick:t,variant:"secondary",children:"Statistics"})]})]})},Y=({onOpenCreate:t})=>e.jsxs(J,{title:"Liteservers",mainButtonAction:t,mainButtonText:"Create Liteserver",guideButtonLink:_.DOCUMENTATION_LITESERVERS,isBeta:!0,children:[e.jsx(a,{textStyle:"body2",children:"The LiteServers service allows you to create and gain direct access to LiteServers in the TON network."}),e.jsx(a,{textStyle:"body2",mt:4,children:"Enjoy seamless access to TON blockchain data without the complexity and overhead of full synchronization on your infrastructure."})]}),re=()=>{const{isOpen:t,onOpen:s,onClose:i}=M(),{isOpen:d,onOpen:n,onClose:r}=M(),{data:l=[],isLoading:p}=P(),{data:c}=q();return p?e.jsx(L,{h:"300px",children:e.jsx(I,{})}):l.length===0?e.jsxs(e.Fragment,{children:[e.jsx(Y,{onOpenCreate:s}),";",e.jsx(H,{isOpen:t,onClose:i})]}):e.jsxs(e.Fragment,{children:[e.jsxs(F,{h:"fit-content",children:[e.jsxs(o,{gap:4,mb:"4",children:[e.jsxs(o,{direction:"column",gap:2,children:[e.jsxs(o,{align:"center",gap:4,children:[e.jsx(O,{children:"Liteservers"}),e.jsx(X,{textStyle:"label3",color:"accent.orange",fontFamily:"body",bgColor:"color-mix(in srgb, currentColor 12%, transparent)",children:"BETA"})]}),e.jsxs(o,{align:"baseline",gap:2,children:[e.jsxs(a,{textStyle:"text.body2",color:"text.secondary",fontSize:14,children:["Your current plan:"," ",c?`${c.name} (${c.rps} RPS)`:"..."]}),e.jsx(z,{as:T,ml:"auto",color:"accent.blue",to:"./pricing",children:"Change"})]})]}),e.jsx(D,{ml:"auto",leftIcon:e.jsx(R,{w:"20px",h:"20px"}),size:"md",height:"100%",variant:"secondary",href:_.DOCUMENTATION_LITESERVERS,isExternal:!0,children:"Liteservers Doc"})]}),e.jsx(G,{onStatisticsClick:n})]}),e.jsx(W,{isOpen:d,onClose:r})]})};export{re as default};
