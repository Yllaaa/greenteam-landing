import style from "./content.module.scss"

export function Divider() {
    return (
        <div className={style.divider}></div>
    )
}

export function Error({
    message
}: {
    message?: string
}) {
    return (
        <div className={style.error}>
            {message}
        </div>
    )
}

function Content({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className={style.content}>
            <div>
                <form>
                    {children}
                </form>
            </div>
        </div>
    )
}

export default Content