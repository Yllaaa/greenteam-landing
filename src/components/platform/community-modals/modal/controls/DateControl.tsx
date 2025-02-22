import style from "../content.module.scss"

export function DateControl({
    label,
    children,
    ...props
}: {
    label: string,
    children?: React.ReactNode,
}) {
    return (
        <div>
            <div className={style.row}>
                <div className={style.text}>
                    <label>{label}</label>
                </div>
                <div className={style.control1}>
                    <input type="date" {...props} />
                </div>
            </div>
            {children}
        </div>
    )
}