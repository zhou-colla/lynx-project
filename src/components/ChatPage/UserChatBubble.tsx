import './Chat.css'

export function UserChatBubble(props: { text: string }) {
  return (
    <view className="user-bubble">
      <text text-selection={true} flatten={false}>{props.text}</text>
    </view>
  )
}