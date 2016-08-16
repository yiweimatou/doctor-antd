const items = {
    15: {
        label: '医疗器械',
        value: 15,
        zoom: 4,
        isLeaf: false
    },
    14: {
        label: '其他',
        value: 14,
        isLeaf: false,
        zoom: 4,
    },
    8: {
        label: '化妆品',
        value: 8,
        isLeaf: false,
        zoom: 4,
    },
    12: {
        label: '科学研究',
        value: 12,
        isLeaf: false,
        zoom: 4,
    },
    3: {
        label: '疾病',
        value: 3,
        isLeaf: false,
        zoom: 4,
    },
    4: {
        label: '药物',
        value: 4,
        isLeaf: false,
        zoom: 4,
    },
    13: {
        label: '医学形态',
        isLeaf: false,
        value: 13,
        zoom: 4,
    },
    10: {
        label: '医疗卫生机构',
        isLeaf: false,
        value: 10,
        zoom: 4,
    },
    2: {
        label: '医学教育',
        value: 2,
        isLeaf: false,
        zoom: 4,
    },
    5: {
        label: '手术',
        value: 5,
        isLeaf: false,
        zoom: 4,
    },
    6: {
        label: '医疗项目',
        value: 6,
        isLeaf: false,
        zoom: 4,
    },
    7: {
        label: '保健',
        value: 7,
        isLeaf: false,
        zoom: 4,
    },
    9: {
        label: '中医名典',
        value: 9,
        isLeaf: false,
        zoom: 4,
    },
    11: {
        label: '继续教育',
        value: 11,
        isLeaf: false,
        zoom: 4,
    }
}

const category = [
    {
        label: '医学专业人员',
        value: 1,
        children: [{
            label: '院校教育',
            value: 11,
            children: [items[2], items[3], items[4], items[5], items[6], items[9], items[13],items[14]]
            }, {
                label: '毕业后教育',
                value: 12,
                children: [items[11], items[2], items[3], items[4], items[5], items[6], items[13], items[14]]
            }, {
                label: '继续教育',
                value: 11,
                children: [
                    items[11],items[3], items[2], items[4], items[5], items[6], items[13], items[14]
                ]
            }, {
                label: '科学研究',
                value: 14,
                children: [
                    items[12], items[3], items[4], items[15], items[13], items[14], items[10]
                ]
            }]
    },{
        label: '普通大众',
        value: 2,
        children: [{
            label: '男',
            value: 21,
            children: [
                {
                    label: '生殖',
                    value: 211,
                    children: [
                        items[7], items[3], items[4], items[10],items[15], items[6], items[5], items[13],  items[14]]
                }, {
                    label: '婴幼儿',
                    value: 212,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[6], items[5], items[15], items[13], items[14]
                    ]
                }, {
                    label: '儿童',
                    value: 213,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[6], items[5], items[15], items[13], items[14]
                    ]
                }, {
                    label: '成年',
                    value: 214,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[9], items[6], items[5], items[15], items[13], items[14]
                    ]
                }, {
                    label: '老年',
                    value: 215,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[9], items[6], items[5], items[15], items[13], items[14]
                    ]
                }
            ]
        }, {
            label: '女',
            value: 22,
            children: [
                {
                    label: '生殖',
                    value: 221,
                    children: [
                        items[7], items[3], items[4], items[10],items[15], items[6], items[5], items[13],  items[14]]
                }, {
                    label: '婴幼儿',
                    value: 222,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[6], items[5], items[15], items[13], items[14]
                    ]
                }, {
                    label: '儿童',
                    value: 223,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[6], items[5], items[15], items[13], items[14]
                    ]
                }, {
                    label: '成年',
                    value: 224,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[9], items[6], items[5], items[15], items[13], items[14]
                    ]
                }, {
                    label: '老年',
                    value: 225,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[9], items[6], items[5], items[15], items[13], items[14]
                    ]
                }
            ]
        }, {
            label: '不限',
            value: 23,
            children: [
                {
                    label: '生殖',
                    value: 231,
                    children: [
                        items[7], items[3], items[4], items[10],items[15], items[6], items[5], items[13],  items[14]]
                }, {
                    label: '婴幼儿',
                    value: 232,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[6], items[5], items[15], items[13], items[14]
                    ]
                }, {
                    label: '儿童',
                    value: 233,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[6], items[5], items[15], items[13], items[14]
                    ]
                }, {
                    label: '成年',
                    value: 234,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[9], items[6], items[5], items[15], items[13], items[14]
                    ]
                }, {
                    label: '老年',
                    value: 235,
                    children: [
                        items[7], items[3], items[4], items[10], items[8],
                        items[9], items[6], items[5], items[15], items[13], items[14]
                    ]
                }
            ]
        }]
    }
]

export default category