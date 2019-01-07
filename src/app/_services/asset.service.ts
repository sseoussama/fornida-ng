import { Injectable } from '@angular/core';
declare const document: any;

@Injectable()
export class AssetService {
    removeScript(path: string) {
        // TODO: Remove DOM element that has attribute `data-path="${path}"`
    }

    loadScript(path: string): Promise<any> {
        return new Promise(resolve => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = path;
            script.setAttribute('data-path', path);

            // IE
            if (script.readyState) {
                script.onreadystatechange = () => {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        resolve({ loaded: true, status: 'Loaded' });
                    }
                };
            } else {
                script.onload = () => {
                    resolve({ loaded: true, status: 'Loaded' });
                };
            }

            script.onerror = (error: any) => resolve({ loaded: false, status: 'Loaded' });
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }
}