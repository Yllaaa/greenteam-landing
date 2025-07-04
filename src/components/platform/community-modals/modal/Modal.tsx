import Actions from "./Actions"
import Content from "./Content"
import Header from "./Header"
import styles from "./modal.module.css"

function Modal({
    show,
    headerText,
    headerSubText,
    onClose,
    onConfirm,
    onCancel,
    children
}: {
    show: boolean,
    headerText: string,
    headerSubText: string,
    onClose: () => void,
    onConfirm: () => void,
    onCancel: () => void,
    children?: React.ReactNode
}) {
    return (
        <div className={styles.addNewPage} style={show ? { display: "block" } : { display: "none" }}>
            <div>
                <Header headerText={headerText} headerSubText={headerSubText} onClose={onClose} />
            </div>
            <div>
                <Content>{children}</Content>
            </div>
            <div>
                <Actions onConfirm={onConfirm} onCancel={onCancel} />
            </div>
        </div>
    )
}

export default Modal