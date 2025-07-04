import style from "../content.module.scss"

export function TextControl({
    label,
    area = false,
    children,
    ...props
}: {
    label: string,
    children?: React.ReactNode,
    area?: boolean,
}) {
    return (
        <div>
            <div className={style.row}>
                <div className={style.text}>
                    <label>{label}</label>
                </div>
                <div className={style.control1}>
                    {!area && <input type="text" {...props} />}
                    {area && <textarea {...props} />}
                </div>
            </div>
            {children}
        </div>
    )
}