'use client'
import React from 'react'
import MyChallenges from './myChallenge/MyChallenges'
// import { CommentModal } from '../posts/feeds/commentModal/CommentModal'
import AllChallenges from './allChallenges/AllChallenges'
import styles from './ChallengePage.module.scss'
import { useTranslations } from 'next-intl'
import AddNewModal from '../a-header/SubHeader/doChallenges/myChallenges/modal/addNew/AddNewModal'
function ChallengePage() {
  const t = useTranslations("web.challenges.all");
  const [commentModal, setCommentModal] = React.useState(false)
  const [postComments, setPostComments] = React.useState([])
  const [postId, setPostId] = React.useState('')
  const [commentPage, setCommentPage] = React.useState(1)
  const [repliesPage, setRepliesPage] = React.useState(1)
  const [rerender, setRerender] = React.useState(false)

  const [addNew, setAddNew] = React.useState(false);
  const [challengeId, setChallengeId] = React.useState("");
  const [endpoint, setEndpoint] = React.useState<string>("")
  return (
    <>
      <section className={styles.container}>
        <div className={styles.all}>
          <div className={styles.title}>
            <h2>{t("green")}</h2>
          </div>
          <div className={styles.challenges}>
            <AllChallenges setEndPoint={setEndpoint} addNew={addNew} setChallengeId={setChallengeId} setAddNew={setAddNew} />
          </div>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.myChallenges}>
          <div className={styles.title}>
            <h2>{t("myChallenges")}</h2>
          </div>
          <div className={styles.body}>
            <MyChallenges
              setEndpoint={setEndpoint}
              setCommentModal={setCommentModal}
              postComments={postComments}
              setPostComments={setPostComments}
              postId={postId}
              setCommentPage={setCommentPage}
              commentPage={commentPage}
              setRepliesPage={setRepliesPage}
              repliesPage={repliesPage}
              setRerender={setRerender}
              rerender={rerender}
              setPostId={setPostId}
              commentModal={commentModal}
              setAddNew={setAddNew}
              setChallengeId={setChallengeId}
            />
          </div>
        </div>
      </section>
      {/* {commentModal && (
        <CommentModal
          setCommentModal={setCommentModal}
          postComments={postComments}
          setPostComments={setPostComments}
          postId={postId}
          setCommentsPage={setCommentPage}
          commentsPage={commentPage}
          setRepliesPage={setRepliesPage}
          repliesPage={repliesPage}
          setRerender={setRerender}
          rerender={rerender}
          postMedia={[]}
        />
      )} */}
      {addNew && (
        <AddNewModal
          setAddNew={(value) => {
            setAddNew(value);
            if (!value) setChallengeId("");
          }}
          endpoint={endpoint}
          addNew={addNew}
          challengeId={challengeId}
        />
      )}
    </>
  )
}

export default ChallengePage
