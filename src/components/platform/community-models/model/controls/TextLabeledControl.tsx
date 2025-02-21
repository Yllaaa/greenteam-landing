import style from "../content.module.scss"

export function TextLabeledControl({
    label,
    inputLabel,
    children,
    ...props
}: {
    label: string,
    inputLabel: string,
    children: React.ReactNode
}) {
    return (
        <div>
            <div className={style.row}>
                <div className={style.text}>
                    <label>{label}</label>
                </div>
                <div className={style.control3}>
                    <label className={style.text}>{inputLabel}</label>
                    <input {...props} />
                </div>
            </div>
            {children}
        </div>
    )
}