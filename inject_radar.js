const fs = require('fs');
const path = 'c:\\Users\\Pedro\\Downloads\\John\\Pasta plataforma\\src\\pages\\nexus_provas.html';
const radarPath = 'c:\\Users\\Pedro\\Downloads\\John\\Pasta plataforma\\radar.html';

let content = fs.readFileSync(path, 'utf8');
const radarContent = fs.readFileSync(radarPath, 'utf8');

const search = `</div>
            
        </div>
      </section>
    </div>
  </div>

  
  <div class="boletim-a4-page" data-page="2">`;

const replace = `</div>
            <div class="w-full flex flex-col mt-2">
${radarContent}
            </div>
        </div>
      </section>
    </div>
  </div>

  
  <div class="boletim-a4-page" data-page="2">`;

content = content.replace(search, replace);
fs.writeFileSync(path, content, 'utf8');
console.log('Injected Radar successfully!');
