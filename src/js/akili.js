/**
 * AKILI AI ASSISTANT INJECTION SCRIPT
 * Responsável por injetar e gerenciar o assistente inteligente premium (Akili) na plataforma.
 */

(function () {
    // Evitar múltipla injeção
    if (document.getElementById('akili-widget-btn')) return;

    // 1. Injetar Estrutura HTML e CSS na Body
    const akiliHTML = `
    <!-- CSS Customizado -->
    <style>
    /* Reset local para garantir imunidade */
    #akili-sidebar * {
        box-sizing: border-box;
    }
    
    /* Botão Flutuante (Mascote Livre) */
    #akili-widget-btn {
        position: fixed;
        bottom: 20px;
        right: 30px;
        z-index: 9997;
        background: transparent;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        animation: antigravLevitation 4s ease-in-out infinite; /* Flutuação Base */
    }
    #akili-widget-btn:hover {
        animation-play-state: paused;
    }
    #akili-widget-btn img {
        width: 320px; /* Tamanho AUMENTADO do mascote (Maior ainda) */
        height: auto;
        object-fit: contain;
        z-index: 10;
        position: relative;
        filter: drop-shadow(0 15px 25px rgba(0,0,0, 0.3)); /* Sombra suave liberada para PNGs */
        transition: transform 0.1s ease-out; /* Suavidade no Tracking */
        transform-origin: center center;
    }
    
    /* Animação Hiper-realista de Flutuação */
    @keyframes antigravLevitation {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
    }
    
    /* Animação do Pulso/Glow */
    @keyframes akiliGlow {
        0% { transform: scale(0.95); opacity: 0.3; }
        100% { transform: scale(1.1); opacity: 0.6; }
    }
    
    /* Overlay Blur */
    #akili-overlay {
        position: fixed;
        inset: 0;
        background: rgba(11, 25, 60, 0.5); /* Escurecimento discreto e elegante */
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 9998;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #akili-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }
    
    /* Aba Lateral (Sidebar Premium) */
    #akili-sidebar {
        position: fixed;
        top: 0;
        right: 0;
        height: 100%;
        width: 100%;
        max-width: 440px;
        background: rgba(255, 255, 255, 0.2); /* Glassmorphism Base */
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-left: 1px solid rgba(255, 255, 255, 0.3);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        box-shadow: -20px 0 60px rgba(11, 25, 60, 0.2);
        display: flex;
        flex-direction: column;
        font-family: 'Inter', sans-serif;
    }
    #akili-sidebar.active {
        transform: translateX(0);
    }
    @media (max-width: 480px) {
        #akili-sidebar { max-width: 100%; border-radius: 0; }
        #akili-widget-btn { bottom: 20px; right: 20px; width: 60px; height: 60px; }
    }
    
    /* Cabeçalho */
    .akili-glass-header {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(11, 25, 60, 0.05);
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        position: relative;
        z-index: 10;
        box-shadow: 0 4px 20px rgba(0,0,0,0.02);
    }
    
    /* Área de Conversa */
    .akili-msg-bubble {
        max-width: 85%;
        padding: 18px 22px;
        border-radius: 20px;
        font-size: 14.5px;
        line-height: 1.65;
        letter-spacing: 0.01em;
        animation: akiliMsgFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        transform-origin: bottom center;
        word-wrap: break-word;
        white-space: pre-wrap;
    }
    .akili-msg-ai {
        background: #F8FAFC;
        color: #1E293B;
        border: 1px solid rgba(11,25,60,0.04);
        border-bottom-left-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        align-self: flex-start;
    }
    .akili-msg-user {
        background: linear-gradient(135deg, #0B193C, #182855);
        color: #FFFFFF;
        border-bottom-right-radius: 6px;
        box-shadow: 0 8px 24px rgba(11,25,60,0.18);
        align-self: flex-end;
    }
    
    /* Mensagem de Erro */
    .akili-msg-error {
        background: #FEF2F2;
        color: #991B1B;
        border: 1px solid #FCA5A5;
        border-bottom-left-radius: 6px;
        font-size: 13.5px;
        align-self: center;
        text-align: center;
    }
    
    @keyframes akiliMsgFadeIn {
        0% { opacity: 0; transform: translateY(15px) scale(0.96); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    /* Loading Indicator Premium */
    .akili-typing-indicator {
        display: flex;
        gap: 5px;
        padding: 18px 22px;
        background: #F8FAFC;
        border: 1px solid rgba(11,25,60,0.04);
        border-radius: 20px;
        border-bottom-left-radius: 6px;
        align-self: flex-start;
        align-items: center;
        animation: akiliMsgFadeIn 0.3s ease-out forwards;
        box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    .akili-typing-dot {
        width: 6px;
        height: 6px;
        background: #94A3B8;
        border-radius: 50%;
        display: inline-block;
        animation: akiliBounce 1.4s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08) both;
    }
    .akili-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .akili-typing-dot:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes akiliBounce {
        0%, 80%, 100% { transform: scale(0.5); opacity: 0.4; background: #94A3B8; }
        40% { transform: scale(1.1); opacity: 1; background: #6366F1; }
    }
    
    /* Scrollbar */
    .akili-scroll::-webkit-scrollbar { width: 5px; }
    .akili-scroll::-webkit-scrollbar-track { background: transparent; }
    .akili-scroll::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
    .akili-scroll::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
    
    /* Textarea Responsivo */
    .akili-textarea {
        width: 100%;
        background: transparent;
        color: #1E293B;
        font-size: 15px;
        padding: 16px 56px 16px 20px;
        outline: none;
        resize: none;
        max-height: 150px;
        border-radius: 24px;
        font-family: inherit;
        font-weight: 500;
        border: none;
    }
    .akili-textarea::placeholder {
        color: #94A3B8;
        font-weight: 400;
    }
    
    /* Outline Gradient Input */
    .akili-input-wrap {
        position: relative;
        display: flex;
        align-items: flex-end;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 24px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        transition: all 0.3s ease;
    }
    .akili-input-wrap:focus-within {
        border-color: #6366F1;
        box-shadow: 0 0 0 3px rgba(99,102,241,0.1), 0 4px 15px rgba(0,0,0,0.03);
    }
    
    /* Layout Helpers */
    .akili-hide { display: none !important; }
    </style>
    
    <!-- Botão Flutuante Akili -->
    <div id="akili-widget-btn" onclick="window.akili.toggle()">
        <img src="../../public/imagens/Akili/Akili_transparente.png" alt="Akili AI">
    </div>
    
    <!-- Overlay Escuro -->
    <div id="akili-overlay" onclick="window.akili.toggle()"></div>
    
    <!-- Sidebar Premium -->
    <div id="akili-sidebar">
        <!-- Header -->
        <div class="akili-glass-header">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="position: relative; width: 48px; height: 48px; border-radius: 50%; background: transparent; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; display: flex; align-items: center; justify-content: center;">
                    <img style="width: 140%; height: 140%; object-fit: cover; transform: translateY(4px); scale: 1.2;" src="../../public/imagens/Akili/Akili_transparente.png" alt="Akili Avatar">
                    <!-- Online Ponto -->
                    <div style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: #10B981; border: 2px solid #FFFFFF; border-radius: 50%; z-index: 10;"></div>
                </div>
                <div>
                    <h3 style="font-family: 'Playfair Display', serif; font-weight: 800; font-size: 20px; color: #0B193C; margin: 0; line-height: 1;">Akili</h3>
                    <p style="font-size: 11px; font-weight: 700; color: #6366F1; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0 0;">Mentor Med</p>
                </div>
            </div>
            <button onclick="window.akili.toggle()" style="width: 40px; height: 40px; border-radius: 50%; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #94A3B8; transition: all 0.2s;" onmouseover="this.style.backgroundColor='#F1F5F9'; this.style.color='#1E293B'" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#94A3B8'">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        
        <!-- Chat Area -->
        <div id="akili-chat-area" class="akili-scroll" style="flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; background: #FFFFFF; position: relative;">
            
            <!-- Mensagem Inicial -->
            <div class="akili-msg-bubble akili-msg-ai">
                Olá. Eu sou <strong>Akili</strong>. Estou aqui para transformar dúvida em clareza, estratégia e avanço real nos seus estudos.<br><br>Como posso impulsionar seu desempenho hoje?
            </div>
            
            <!-- Placeholder para Loading (Injetado via JS) -->
        </div>
        
        <!-- Input Area -->
        <div style="padding: 20px 24px; background: #FFFFFF; border-top: 1px solid #F8FAFC; flex-shrink: 0; z-index: 10;">
            <div class="akili-input-wrap">
                <textarea id="akili-input" rows="1" placeholder="Pergunte ao Akili..." class="akili-textarea akili-scroll" oninput="window.akili.resize(this)" onkeydown="window.akili.handleKey(event)"></textarea>
                
                <button onclick="window.akili.send()" id="akili-send-btn" style="position: absolute; right: 10px; bottom: 10px; width: 40px; height: 40px; background: #0B193C; color: #FFFFFF; border: none; border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(11,25,60,0.15);" onmouseover="this.style.backgroundColor='#6366F1'; this.style.transform='scale(1.05)';" onmouseout="this.style.backgroundColor='#0B193C'; this.style.transform='scale(1)';">
                    <span class="material-symbols-outlined" style="font-size: 20px; margin-left: 2px;">send</span>
                </button>
            </div>
            <p style="text-align: center; font-size: 10px; color: #94A3B8; font-weight: 500; margin: 12px 0 0 0; letter-spacing: 0.02em;">Akili é uma inteligência de elite e está em constante aprimoramento.</p>
        </div>
    </div>
    `;

    // 2. Inserir no DOM
    const wrapper = document.createElement('div');
    wrapper.innerHTML = akiliHTML;
    document.body.appendChild(wrapper);

    // 2.5 Rastreamento Parallax Holográfico do Leão
    setTimeout(() => {
        const lionAvatarBtn = document.getElementById('akili-widget-btn');
        if (!lionAvatarBtn) return;
        const lionAvatarImg = lionAvatarBtn.querySelector('img');
        
        if (lionAvatarImg) {
            document.addEventListener('mousemove', (e) => {
                // Se a barra estiver aberta ou o bixo invisível, não faz
                if (window.akili && window.akili.isOpen) {
                    lionAvatarImg.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
                    return;
                }
                
                const rect = lionAvatarImg.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // Distância do Cursor
                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                
                // Amplificador de Inclinação (Max depende da tela)
                const rotateY = (deltaX / window.innerWidth) * 35; 
                const rotateX = -(deltaY / window.innerHeight) * 35;
                
                lionAvatarImg.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            });
            
            // Voltar ao normal quando mouse sair
            document.addEventListener('mouseleave', () => {
                lionAvatarImg.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        }
    }, 100);

    // 3. Lógica do Akili Exposta Globalmente (Namespaced)
    window.akili = {
        isOpen: false,
        isLoading: false,
        webhookUrl: 'https://johnnsinapse.app.n8n.cloud/webhook-test/ia-aluno',
        
        toggle: function() {
            const sidebar = document.getElementById('akili-sidebar');
            const overlay = document.getElementById('akili-overlay');
            const btn = document.getElementById('akili-widget-btn');
            const input = document.getElementById('akili-input');
            
            this.isOpen = !this.isOpen;
            
            if (this.isOpen) {
                sidebar.classList.add('active');
                overlay.classList.add('active');
                btn.classList.remove('closed-glow'); // Para a pulsação de chamada a ação
                // Auto focus text com leve delay p/ transição
                setTimeout(() => input.focus(), 600);
            } else {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                // Retoma respiração 
                setTimeout(() => btn.classList.add('closed-glow'), 600);
            }
        },
        
        resize: function(el) {
            el.style.height = 'auto';
            el.style.height = (el.scrollHeight) + 'px';
            if (el.value === '') {
                el.style.height = 'auto'; // reset
            }
        },
        
        handleKey: function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.send();
            }
        },
        
        scrollToBottom: function() {
            const chatArea = document.getElementById('akili-chat-area');
            setTimeout(() => {
                chatArea.scrollTo({
                    top: chatArea.scrollHeight,
                    behavior: 'smooth'
                });
            }, 50);
        },
        
        addMessage: function(text, type='ai', isError=false) {
            const chatArea = document.getElementById('akili-chat-area');
            const msgDiv = document.createElement('div');
            
            if(type === 'user') {
                msgDiv.className = 'akili-msg-bubble akili-msg-user';
            } else if(isError) {
                msgDiv.className = 'akili-msg-bubble akili-msg-error';
            } else {
                msgDiv.className = 'akili-msg-bubble akili-msg-ai';
            }
            
            msgDiv.innerText = text;
            chatArea.appendChild(msgDiv);
            this.scrollToBottom();
        },
        
        showTyping: function() {
            this.hideTyping(); // Previne duplicidade
            const chatArea = document.getElementById('akili-chat-area');
            const typingDiv = document.createElement('div');
            typingDiv.id = 'akili-typing';
            typingDiv.className = 'akili-typing-indicator';
            typingDiv.innerHTML = `
                <span class="akili-typing-dot"></span>
                <span class="akili-typing-dot"></span>
                <span class="akili-typing-dot"></span>
            `;
            chatArea.appendChild(typingDiv);
            this.scrollToBottom();
        },
        
        hideTyping: function() {
            const typingDiv = document.getElementById('akili-typing');
            if (typingDiv) typingDiv.remove();
        },
        
        send: async function() {
            const inputEl = document.getElementById('akili-input');
            const text = inputEl.value.trim();
            
            if (!text || this.isLoading) return;
            
            // UI Update: Manda pro Chat
            this.addMessage(text, 'user');
            
            // Clear input
            inputEl.value = '';
            inputEl.style.height = 'auto';
            
            // Set State
            this.isLoading = true;
            this.showTyping();
            
            const btnSend = document.getElementById('akili-send-btn');
            btnSend.style.opacity = '0.5';
            btnSend.style.pointerEvents = 'none';
            
            try {
                // Fetch N8N
                const response = await fetch(this.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pergunta: text })
                });
                
                let answerText = "";
                
                if (response.ok) {
                    const textData = await response.text();
                    let data = {};
                    if(textData) {
                        try {
                            data = JSON.parse(textData);
                        } catch(e) {
                            data = { resposta: textData }; // Se retornar texto puro
                        }
                    }

                    if (data && data.resposta) {
                        answerText = data.resposta;
                    } else if (textData === "") {
                        answerText = "Recebi sua mensagem, mas o servidor do n8n não me enviou nenhuma resposta. Verifique a configuração do seu Webhook no n8n (certifique-se de que ele não está respondendo 'Immediately' e sim com os dados).";
                    } else {
                        // Fallback temporário para debugar formato estranho
                        answerText = "Resposta em formato não reconhecido: " + JSON.stringify(data);
                    }
                    this.hideTyping();
                    this.addMessage(answerText, 'ai');
                } else {
                    this.hideTyping();
                    this.addMessage('Akili não conseguiu responder agora. Tente novamente em instantes.', 'ai', true);
                }
            } catch (error) {
                console.error('Akili Webhook Error:', error);
                this.hideTyping();
                this.addMessage('O servidor do Akili está indisponível no momento. Verifique sua conexão.', 'ai', true);
            } finally {
                this.isLoading = false;
                btnSend.style.opacity = '1';
                btnSend.style.pointerEvents = 'auto';
                inputEl.focus();
            }
        }
    };
})();
