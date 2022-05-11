import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  texts: {[key: string]: string} = {
    bar: 'Colonnes',
    line: 'Lignes',
    pie: 'Camembert',
    map: 'Carte',
    cnt: 'Compter',
    sum: 'Somme',
    avg: 'Moyenne',

    quart_nom: 'Nom du quartier',
    date_data: 'Date',
    quart_proport_proprio: 'Proportion moyenne de propriétaires',
    quart_revenu_moy: 'Revenu moyen',
    prode_pot: 'Production électrique potentielle moyenne par m² de toiture',
    quart_code: 'Code',
    quart_an_contruct_moy: 'Année de construction moyene',
  }

  t(key: string): string {
    return this.texts[key] ? this.texts[key] : key
  }
}
