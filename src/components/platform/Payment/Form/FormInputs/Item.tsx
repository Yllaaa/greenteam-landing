// import styles from './form-inputs.module.scss'

// import React from 'react';

// interface ItemProps {
//     label: string;
//     placeholder?: string;
// }

// const Item: React.FC<ItemProps> = ({ label, ...props }) => {
//     return (
//         <div className={styles.item}>
//             <div className={styles.text}>{label}</div>
//             <input {...props} placeholder={props.placeholder} />
//         </div>
//     );
// };

// export default Item;

// Item.tsx
import styles from './form-inputs.module.scss'
import React from 'react';

interface ItemProps {
    label: string;
    placeholder?: string;
    error?: string;
}

const Item: React.FC<ItemProps & React.InputHTMLAttributes<HTMLInputElement>> = ({ 
    label, 
    error,
    ...props 
}) => {
    return (
        <div className={styles.item}>
            <div className={styles.text}>{label}</div>
            <input {...props} placeholder={props.placeholder} className={error ? styles.inputError : ''} />
            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
};

export default Item;