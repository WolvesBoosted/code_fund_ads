import { Controller } from 'stimulus'

export default class extends Controller {
  toggleTheme (event) {
    let skin = Looper.skin === 'dark' ? 'default' : 'dark';
    Looper.setSkin(skin);
    location.reload();
  }
}
