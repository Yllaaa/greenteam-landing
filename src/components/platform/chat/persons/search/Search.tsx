// import Image from 'next/image'
// import styles from './search.module.scss'
// import searchIcon from '@/../public/chat/search.svg'
// import { filterPersons, getPersons, PersonItem } from './persons.data'
// import { ChangeEvent, useEffect, useState } from 'react';

// export default function Search({ setFilteredPersons }: { setFilteredPersons: (filteredPersons: PersonItem[]) => void }) {
//     const [persons, setPersons] = useState<PersonItem[]>([]);
//     useEffect(() => {
//         getPersons().then(persons => {
//             setPersons(persons);
//             setFilteredPersons(persons);
//         });
//     }, [setFilteredPersons]);

//     function handleSearch(e: ChangeEvent<HTMLInputElement>) {
//         const filteredPersons = filterPersons(persons, e.target.value);
//         setFilteredPersons(filteredPersons);
//     }
//     return (
//         <div className={styles.search}>
//             <input type="text" placeholder="Search" onChange={handleSearch} />
//             <Image className={styles.icon} src={searchIcon} alt="search" width={20} height={20} />
//         </div>
//     )
// }