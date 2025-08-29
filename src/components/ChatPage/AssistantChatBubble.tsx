import './Chat.css'

export function AssistantChatBubble(props: { text: string }) {
  return (
    <view className="assistant-bubble">
      <text text-selection={true} flatten={false}>{props.text}</text>
    </view>
  )
}