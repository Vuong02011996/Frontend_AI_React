export async function getMenuLeft() {
    return [
        {
            title: 'Quản lý camera',
            key: 'productstype',
            icon: 'icon icon-list',
            url: ['/camera', '/camera/them-moi', '/camera/:id/chi-tiet'],
            permission: [],
        },
        {
            title: 'Dữ liệu khuôn mặt đối tượng',
            key: 'face',
            icon: 'icon icon-list',
            url: ['/quan-ly/du-lieu-khuon-mat-doi-tuong'],
            permission: [],
        },
        {
            title: 'Báo cáo điểm danh',
            key: 'schedules',
            icon: 'icon icon-list',
            permission: [],
            children: [
                // {
                //     title: 'Báo cáo điểm danh',
                //     // key: 'identification',
                //     key: 'report',
                //     url: ['/quan-ly/bao-cao-diem-danh'],
                //     permission: [],
                // },
                {
                    title: 'Kết quả điểm danh',
                    key: 'identification',
                    url: ['/quan-ly/ket-qua-diem-danh'],
                    permission: [],
                },
                {
                    title: 'Báo cáo chi tiết',
                    key: 'report-date',
                    url: ['/quan-ly/bao-cao-hang-ngay', '/quan-ly/bao-cao-theo-doi-tuong'],
                    permission: [],
                },
            ],
        },
        {
            title: 'Báo cáo vùng an toàn',
            key: 'productGroup',
            icon: 'icon icon-list',
            url: ['/quan-ly/vung-an-toan', '/quan-ly/vung-an-toan/:id/chi-tiet'],
            permission: [],
        },

        {
            title: 'Báo cáo trằn trọc',
            key: 'sleepless',
            icon: 'icon icon-list',
            permission: [],
            children: [
                {
                    title: 'Định danh',
                    key: 'sleepless-identification',
                    url: ['/quan-ly/tran-troc-khong-ngu/dinh-danh'],
                    permission: [],
                },
                {
                    title: 'Báo cáo',
                    key: 'sleepless-report',
                    url: ['/quan-ly/tran-troc-khong-ngu/bao-cao'],
                    permission: [],
                },
            ],
        },
        {
            title: 'Báo cáo té ngã',
            key: 'behavior',
            icon: 'icon icon-list',
            // url: ['/quan-ly/hanh-vi', '/quan-ly/hanh-vi/:id/chi-tiet'],
            url: ['/quan-ly/te-nga'],
            permission: [],
        },
    ];
}
