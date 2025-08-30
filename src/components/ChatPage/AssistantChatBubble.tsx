import './Chat.css'
import type { Dispatch, SetStateAction } from '@lynx-js/react';
import ChevronRightIcon from '../../assets/white-right-arrow.png'
import ReplyIcon from '../../assets/reply-icon.png'
import type ChatHistory from '../ChatSession/ChatHistory.js';

export function AssistantChatBubble(props: { 
  text: string,
  chatInstance: ChatHistory | null,
  setIsReplying: Dispatch<SetStateAction<boolean>>, 
  setReplyMessageText: Dispatch<SetStateAction<string>>
}) {
  const handleReply = () => {
    props.setIsReplying(true);
    props.setReplyMessageText(props.text);
    props.chatInstance?.setReplying(true);
    props.chatInstance?.setReplyMessage(props.text);
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