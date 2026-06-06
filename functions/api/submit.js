export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        const nickname = formData.get('nickname')?.trim() || '';
        const message = formData.get('message')?.trim() || '';

        if (!nickname || !message) {
            return new Response(JSON.stringify({
                success: false,
                message: '请填写完整信息'
            }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        if (nickname.length > 50) {
            return new Response(JSON.stringify({
                success: false,
                message: '昵称不能超过50个字符'
            }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const result = await context.env.DB.prepare(
            'INSERT INTO messages (nickname, message) VALUES (?, ?)'
        ).bind(nickname, message).run();

        return new Response(JSON.stringify({
            success: true,
            message: '留言提交成功！',
            data: {
                id: result.meta.last_row_id,
                nickname: nickname,
                message: message,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
        }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: '提交失败: ' + error.message
        }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}