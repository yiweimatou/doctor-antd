const items = {
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

const category = {
    1: [items[79287], items[79288], items[79289], items[79290], items[79291], items[79294], items[4],{
        label: '其他',
        isLeaf: false,
        zoom: 4
    }],
    2: [items[79296], items[79287], items[79288], items[79289], items[79290], items[79291], items[4], {
        label: '其他',
        isLeaf: false,
        zoom: 4
    }],
    4: [items[79297], items[79288], items[79289], {
        label: '医疗器械',
        isLeaf: false,
        zoom: 4
    }, items[4], {
        label: '其他',
        isLeaf: false,
        zoom: 4
    }, items[79295]]
}

export default category