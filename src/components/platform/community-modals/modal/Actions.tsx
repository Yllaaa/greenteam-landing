import { useTranslations } from 'next-intl'
import style from './actions.module.scss'

function Actions({
    onConfirm,
    onCancel
}: {
    onConfirm: () => void,
    onCancel: () => void
}) {
    const t = useTranslations('community-models.actions');
    return (
        <div className={style.actions}>
            <div className={style.dividerWrap}>
                <div className={style.divider}></div>
            </div>
            <div className={style.content}>
                <button onClick={onCancel} className={style.cancel}>{t('cancel')}</button>
                <button onClick={onConfirm} className={style.confirm}>{t('confirm')}</button>
            </div>
        </div>
    )
}

export default Actions