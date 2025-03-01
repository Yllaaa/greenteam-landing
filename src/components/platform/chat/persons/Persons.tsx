import { useRef, useState } from 'react';
import styles from './persons.module.scss'
import { PersonItem } from './search/persons.data';
import Item from './Item';
import Search from './search/Search';

type PersonsProps = { personId: string, setPersonId: (id: string) => void }

export default function Persons({ personId, setPersonId }: PersonsProps) {
    const [filteredPersons, setFilteredPersons] = useState<PersonItem[]>([]);
    const activeRef = useRef<boolean>(true);

    function handleSetPersonId(id: string) {
        if (activeRef.current) {
            activeRef.current = false;
            setPersonId(id);
            setTimeout(() => activeRef.current = true, 500);
        }
    }

    return (
        <div className={styles.persons}>
            <Search setFilteredPersons={setFilteredPersons} />
            {filteredPersons.map((person, index) =>
                <Item
                    selected={personId == person.id}
                    onClick={() => handleSetPersonId(person.id)}
                    key={index}
                    {...person} />
            )}
        </div>
    )
}