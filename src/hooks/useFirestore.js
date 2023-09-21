import { useEffect, useState } from 'react';
import { db } from '../firebase/config';

// Hooks useFirestore Dùng để lấy dữ liệu các documents của một collection kèm theo các điều kiện chọn document nếu có.
// Để lọc dữ liệu document từ collection về ta dùng condition với các câu lệnh như where, ...
const useFirestore = (collection, condition) => {
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        // chú ý tên createdAt phải đúng chính tả vì lúc addDocument ta dùng key createdAt
        // let collectionRef = db.collection(collection);
        let collectionRef = db.collection(collection).orderBy('created_at', 'desc');

        // collectionRef.where('name', '==', 'Tung')
        /**Condition
         * fieldName: 'abc',
         * operator: ==, >=, <= , in, not-in, ...
         * compareValue: 'abb'
         */
        if (condition) {
            // firestore sẽ không chấp nhận compareValue là null hoặc empty array
            if (!condition.compareValue || condition.compareValue.length === 0) {
                return;
            }
            collectionRef = collectionRef.where(condition.fieldName, condition.operator, condition.compareValue);
        }
        //  event listner onSnapshot sẽ lắng nghe khi có sự thay đổi dữ liệu ở collection và call back trong onSnapshot sẽ được thực thi
        // snapshot.docs: dữ liệu của tất cả document trong collection ,
        // doc.data: dữ liệu của từng document trong collection
        const cleanEvenlistner = collectionRef.onSnapshot((snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
                // data() đây là một hàm có sẵn trong file firestore dùng để lấy và convert dữ liệu document từ db ra object javascripts.
                ...doc.data(),
                id: doc.id,
            }));

            // ({
            //     // data() đây là một hàm có sẵn trong file firestore dùng để lấy và convert dữ liệu document từ db ra object javascripts.
            //     ...doc.data(),
            //     id: doc.id,
            // }));
            setDocuments(documents);
        });
        return () => cleanEvenlistner();

        // khi dữ liệu collection, condition thay đổi sẽ gọi clean up trước đển hủy bỏ event listner cũ trước khi tạo listner mới để lắng nghe.
    }, [collection, condition]);

    return documents;
};

export default useFirestore;
