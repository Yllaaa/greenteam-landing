import Item from "./Item";
import styles from './community.module.scss'
import pagesLogo from '@/../public/personal/menu/community/pagesLogo.png'
import groupsLogo from '@/../public/personal/menu/community/groupsLogo.png'
import eventsLogo from '@/../public/personal/menu/community/eventsLogo.png'
import productsLogo from '@/../public/personal/menu/community/productsLogo.png'


function Community() {
    return (
        <div className={styles.community}>
            <Item logo={pagesLogo} text={'Pages'} />
            <Item logo={groupsLogo} text={'Groups'} />
            <Item logo={eventsLogo} text={'Events'} />
            <Item logo={productsLogo} text={'Products'} />
        </div>
    )
}

export default Community