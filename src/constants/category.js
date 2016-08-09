const items = {
    2: {
        label: '医疗器械',
        value: 1,
        children:[],
        zoom: 4
    },
    3: {
        label: '其他',
        value: 2,
        children:[],
        zoom: 4
    },
    1: {
        label: '化妆品',
        value: 3,
        zoom: 4,
        children:[]
    },
    79297: {
        label: '科学研究',
        value: 79297,
        isLeaf: false,
        zoom: 4
    },
    79288: {
        label: '疾病',
        value: 79288,
        isLeaf: false,
        zoom: 4
    },
    79289: {
        label: '药物',
        value: 79289,
        isLeaf: false,
        zoom: 4
    },
    4: {
        label: '医学形态',
        isLeaf: false,
        value: 4,
        zoom: 4
    },
    79295: {
        label: '医疗卫生机构',
        isLeaf: false,
        value: 79295,
        zoom: 4
    },
    79287: {
        label: '医学教育',
        value: 79287,
        isLeaf: false,
        zoom: 4
    },
    79290: {
        label: '手术',
        value: 79290,
        isLeaf: false,
        zoom: 4
    },
    79291: {
        label: '医疗项目',
        value: 79291,
        isLeaf: false,
        zoom: 4
    },
    79292: {
        label: '保健',
        value: 79292,
        isLeaf: false,
        zoom: 4
    },
    79293: {
        label: '营养品',
        value: 79293,
        isLeaf: false,
        zoom: 4
    },
    79294: {
        label: '中医名典',
        value: 79294,
        isLeaf: false,
        zoom: 4
    },
    79296: {
        label: '继续教育',
        value: 79296,
        isLeaf: false,
        zoom: 4
    }
}

const category = [
    {
        label: '医学专业人员',
        value: 1,
        children: [{
            label: '院校教育',
            value: 11,
            children: [items[79287], items[79288], items[79289], items[79290], items[79291], items[79294], items[4],items[3]]
            }, {
                label: '毕业后教育',
                value: 12,
                children: [items[79296], items[79287], items[79288], items[79289], items[79290], items[79291], items[4], items[3]]
            }, {
                label: '继续教育',
                value: 13,
                children: [
                    items[79296],items[79288], items[79287], items[79289], items[79290], items[79291], items[4], items[3]
                ]
            }, {
                label: '科学研究',
                value: 14,
                children: [
                    items[79297], items[79288], items[79289], items[2], items[4], items[3], items[79295]
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
                        items[79292], items[79288], items[79289], items[79295],items[2], items[79291], items[79290], items[4],  items[3]]
                }, {
                    label: '婴幼儿',
                    value: 212,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }, {
                    label: '儿童',
                    value: 213,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }, {
                    label: '成年',
                    value: 214,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79294], items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }, {
                    label: '老年',
                    value: 215,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79294], items[79291], items[79290], items[2], items[4], items[3]
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
                        items[79292], items[79288], items[79289], items[79295],items[2], items[79291], items[79290], items[4],  items[3]]
                }, {
                    label: '婴幼儿',
                    value: 222,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }, {
                    label: '儿童',
                    value: 223,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }, {
                    label: '成年',
                    value: 224,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79294], items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }, {
                    label: '老年',
                    value: 225,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79294], items[79291], items[79290], items[2], items[4], items[3]
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
                        items[79292], items[79288], items[79289], items[79295],items[2], items[79291], items[79290], items[4],  items[3]]
                }, {
                    label: '婴幼儿',
                    value: 232,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }, {
                    label: '儿童',
                    value: 233,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }, {
                    label: '成年',
                    value: 234,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79294], items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }, {
                    label: '老年',
                    value: 235,
                    children: [
                        items[79292], items[79288], items[79289], items[79295], items[1],
                        items[79294], items[79291], items[79290], items[2], items[4], items[3]
                    ]
                }
            ]
        }]
    }
]

export default category