import permissions from './permissions';

// Config đường dẫn trên web đi vs component nào
export default [
    {
        path: '/',
        component: '../layouts',
        routes: [
            // Trang chủ
            {
                path: '/',
                redirect: '/camera',
            },
            {
                path: '/login',
                component: './login',
            },
            {
                path: '/verify-token',
                component: './verify-token',
            },
            // Trang camera
            {
                path: '/camera',
                component: './camera',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            {
                path: '/camera/them-moi',
                component: './camera/form',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            {
                path: '/camera/:id/chi-tiet-chinh-sua',
                component: './camera/form',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            {
                path: '/camera/:id/chi-tiet-stream',
                component: './camera/stream',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            // Trang quản lí hồ sơ đối tượng
            {
                path: '/quan-ly/bao-cao-theo-doi-tuong',
                component: './report-name',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            {
                path: '/quan-ly/du-lieu-khuon-mat-doi-tuong',
                component: './identities',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },

            // Trang báo cáo điểm danh

            // {
            //     path: '/quan-ly/bao-cao-diem-danh',
            //     component: './attendance',
            //     wrappers: ['@/wrappers/auth'],
            //     authority: [permissions.ADMIN],
            // },
            {
                path: '/quan-ly/ket-qua-diem-danh',
                component: './attendance-report',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            {
                path: '/quan-ly/bao-cao-hang-ngay',
                component: './report-date',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },

            // Trang báo cáo vùng an toàn
            {
                path: '/quan-ly/vung-an-toan',
                component: './safe-zone-report',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            {
                path: '/quan-ly/vung-an-toan/:id/chi-tiet',
                component: './safe-zone/acction',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },

            // Trang báo cáo hành vi
            {
                path: '/quan-ly/te-nga',
                component: './fall-detection-report',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            // {
            //     path: '/quan-ly/hanh-vi/:id/chi-tiet',
            //     component: './behavior/acction',
            //     wrappers: ['@/wrappers/auth'],
            //     authority: [permissions.ADMIN],
            // },

            // Trang báo cáo trằn trọc không ngủ
            {
                path: '/quan-ly/bao-cao-tran-troc-khong-ngu',
                component: './report-month',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },

            {
                path: '/quan-ly/tran-troc-khong-ngu/dinh-danh',
                component: './sleepless-report/identification',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            {
                path: '/quan-ly/tran-troc-khong-ngu/bao-cao',
                component: './sleepless-report/report',
                wrappers: ['@/wrappers/auth'],
                authority: [permissions.ADMIN],
            },
            {
                path: '/404',
                component: './404',
            },
            {
                component: './404',
            },
        ],
    },
];
