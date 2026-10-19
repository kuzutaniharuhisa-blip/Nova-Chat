// Supabase の Project Settings > API から取得した値を入力してください。
// ここに設定するのは publishable/anon key です。service_role key は絶対に置かないでください。
window.NOVACHAT_CONFIG = {
  url: "https://ailumthgbhxyzjxjiowc.supabase.co",
  anonKey: "sb_publishable_l9J4aq5UVZId8xobcDQiiQ_RT7N3RR3"
};
// 公開チャットのリアルタイム購読
let publicChatChannel = null;

function startPublicChatRealtime() {
  // 二重購読を防止
  if (publicChatChannel) {
    return;
  }

  publicChatChannel = supabase
    .channel('nova-public-chat')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'public_messages'
      },
      async (payload) => {
        console.log('新しいメッセージ:', payload.new);

        // 既存のメッセージ再取得・描画関数に置き換える
        await loadPublicMessages();
      }
    )
    .subscribe((status) => {
      console.log('公開チャットRealtime:', status);
    });
}

function stopPublicChatRealtime() {
  if (!publicChatChannel) return;

  supabase.removeChannel(publicChatChannel);
  publicChatChannel = null;
}
