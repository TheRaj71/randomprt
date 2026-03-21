// Terminal System - Modular Interactive Linux Terminal
class Terminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.output = [];
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentPath = '~';
    this.username = 'shiwani';
    this.hostname = 'debian-server';
    
    this.init();
  }

  init() {
    this.render();
    this.showWelcome();
    this.focusInput();
  }

  render() {
    this.container.innerHTML = `
      <div class="terminal-window">
        <div class="terminal-bar">
          <div class="terminal-buttons">
            <div class="terminal-dot terminal-dot-close"></div>
            <div class="terminal-dot terminal-dot-minimize"></div>
            <div class="terminal-dot terminal-dot-maximize"></div>
          </div>
          <div class="terminal-title">${this.username}@${this.hostname}: ${this.currentPath}</div>
        </div>
        <div class="terminal-body" id="terminal-output">
          <div id="output-lines"></div>
          <div class="terminal-input-line">
            <span class="terminal-prompt">
              <span class="terminal-user">${this.username}</span>@<span class="terminal-host">${this.hostname}</span>:<span class="terminal-path">${this.currentPath}</span>$
            </span>
            <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false">
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-output');

    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleCommand(input.value.trim());
        input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory('down');
      } else if (e.key === 'Tab') {
        e.preventDefault();
      }
    });

    body.addEventListener('click', () => {
      input.focus();
    });
  }

  focusInput() {
    setTimeout(() => {
      const input = document.getElementById('terminal-input');
      if (input) {
        input.focus({ preventScroll: true });
      }
    }, 100);
  }

  showWelcome() {
    const debianLogo = `
       _,met$$$$$gg.
    ,g$$$$$$$$$$$$$$$P.
  ,g$$P"     """Y$$.".
 ,$$P'              \`$$$.
',$$P       ,ggs.     \`$$b:
\`d$$'     ,$P"'   .    $$$
 $$P      d$'     ,    $$P
 $$:      $$.   -    ,d$$'
 $$;      Y$b._   _,d$P'
 Y$$.    \`.\`"Y$$$$P"'
 \`$$b      "-.__
  \`Y$$
   \`Y$$.
     \`$$b.
       \`Y$$b.
          \`"Y$b._
              \`"""
`;

    const systemInfo = `<span class="terminal-user">shiwani</span>@<span class="terminal-host">debian-server</span>
<span class="terminal-success">-------------------</span>
<span class="terminal-info">OS:</span> Debian GNU/Linux 12 (bookworm) x86_64
<span class="terminal-info">Host:</span> Shiwani Portfolio Server
<span class="terminal-info">Kernel:</span> 6.1.0-13-amd64
<span class="terminal-info">Shell:</span> bash 5.2.15
<span class="terminal-info">CPU:</span> Intel Core i7 (8) @ 3.50GHz
<span class="terminal-info">Memory:</span> 14.52GB / 17.18GB (85%)
<span class="terminal-info">Disk:</span> 229.95GB / 245.11GB (94%)`;

    // Create two-column layout
    this.addOutput('<div style="display: grid; grid-template-columns: auto 1fr; gap: 20px; margin-bottom: 20px;">');
    this.addOutput(`<div class="ascii-art" style="color: #FF5F57;">${debianLogo}</div>`);
    this.addOutput(`<div>${systemInfo}</div>`);
    this.addOutput('</div>');
    
    // Helper messages separated
    this.addOutput('');
    this.addOutput('<span class="terminal-success">═══════════════════════════════════════════════════════════════</span>');
    this.addOutput('<span class="terminal-warning">[*] Type "help" to see available commands</span>');
    this.addOutput('<span class="terminal-warning">[*] Type "about" for information about Shiwani</span>');
    this.addOutput('<span class="terminal-warning">[*] Type "projects" to view portfolio projects</span>');
    this.addOutput('<span class="terminal-success">═══════════════════════════════════════════════════════════════</span>');
    this.addOutput('');
  }

  addOutput(text) {
    const outputLines = document.getElementById('output-lines');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = text;
    outputLines.appendChild(line);
    this.scrollToBottom();
  }

  scrollToBottom() {
    const body = document.getElementById('terminal-output');
    body.scrollTop = body.scrollHeight;
  }

  handleCommand(cmd) {
    if (!cmd) return;
    
    this.commandHistory.push(cmd);
    this.historyIndex = this.commandHistory.length;
    
    this.addOutput(`<span class="terminal-prompt"><span class="terminal-user">${this.username}</span>@<span class="terminal-host">${this.hostname}</span>:<span class="terminal-path">${this.currentPath}</span>$</span> <span class="terminal-command">${cmd}</span>`);
    
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    this.executeCommand(command, args);
  }

  navigateHistory(direction) {
    const input = document.getElementById('terminal-input');
    if (direction === 'up' && this.historyIndex > 0) {
      this.historyIndex--;
      input.value = this.commandHistory[this.historyIndex];
    } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      input.value = this.commandHistory[this.historyIndex];
    } else if (direction === 'down') {
      this.historyIndex = this.commandHistory.length;
      input.value = '';
    }
  }


  executeCommand(command, args) {
    // Check if command exists
    if (TerminalCommands[command]) {
      const result = TerminalCommands[command](args, this);
      
      if (result === 'CLEAR') {
        document.getElementById('output-lines').innerHTML = '';
        return;
      }
      
      this.addOutput(result);
    } else if (command) {
      // Command not found
      this.addOutput(`<span class="terminal-error">bash: ${command}: command not found</span>`);
      this.addOutput(`<span class="terminal-warning">Type 'help' to see available commands</span>`);
    }
  }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('terminal-container')) {
    new Terminal('terminal-container');
  }
});
