import './Chat.css'
import type { Dispatch, SetStateAction } from '@lynx-js/react';
import ChevronRightIcon from '../../assets/white-right-arrow.png'
import ReplyIcon from '../../assets/reply-icon.png'

export function AssistantChatBubble(props: { 
  text: string, 
  setIsReplying: Dispatch<SetStateAction<boolean>>, 
  setReplyMessageText: Dispatch<SetStateAction<string>>
}) {
  const handleReply = () => {
    props.setIsReplying(true);
    props.setReplyMessageText(props.text)
  }

  return (
    <view className="assistant-bubble">
      <text text-selection={true} flatten={false}>{props.text}</text>
      <image 
          src={ReplyIcon} 
          className='reply-icon'
          bindtap={handleReply}
      />
    </view>
  )
}