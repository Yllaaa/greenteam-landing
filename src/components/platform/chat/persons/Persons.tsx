import { useEffect, useState } from 'react';
import styles from './persons.module.scss'
import { getPersons, PersonItem } from './persons.data';
import Item from './Item';

type PersonsProps = { personId: string, setPersonId: (id: string) => void }

export default function Persons({ personId, setPersonId }: PersonsProps) {
    const [persons, setPersons] = useState<PersonItem[]>([]);
    useEffect(() => {
        getPersons().then(setPersons);
    }, [])
    return (
        <div className={styles.persons}>
            {persons.map((person, index) =>
                <Item
                    selected={personId == person.id}
                    onClick={() => setPersonId(person.id)}
                    key={index}
                    {...person} />
            )}
        </div>
    )
}