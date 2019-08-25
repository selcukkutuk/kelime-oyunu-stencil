import { Component, h, State } from "@stencil/core";

@Component({
  tag: "app-home",
  styleUrl: "app-home.scss",
  shadow: false
})
export class AppHome {
  @State() sorular: Soru[] = [
    {
      soru: "Siyah ile aynı anlama gelen bir renk.",
      cevap: "KARA",
      soruldu: false
    },
    {
      soru: "Sık kullanılan bir isim.",
      cevap: "AHMET",
      soruldu: false
    },
    {
      soru: "Türkiye'nin başkenti",
      cevap: "ANKARA",
      soruldu: false
    },
    {
      soru: "Karadenizde bir ilimiz",
      cevap: "TRABZON",
      soruldu: false
    }
  ];
  @State() mesaj: string = null;
  @State() mesajClass: string = "";
  @State() mesajSure: any = null;
  @State() mevcutSoru: Soru = null;
  @State() harfler: any[] = [];
  @State() puan: number = 0;
  @State() harfPuan: number = 0;
  @State() yarismaciCevap: string = "";
  @State() tamamlandi: boolean = false;
  @State() sure: any = null;
  @State() kalanSure: number = 0;

  mesajGoster(mesaj: string, tur: MesajTurleri = null): void {
    if (this.mesajSure) {
      clearTimeout(this.mesajSure);
      this.mesajSure = null;
    }
    this.mesaj = mesaj;
    if (tur === MesajTurleri.hata) {
      this.mesajClass = "bg-danger text-white";
    } else if (tur === MesajTurleri.basari) {
      this.mesajClass = "bg-success text-white";
    } else {
      this.mesajClass = "bg-dark text-white";
    }
    this.mesajSure = setTimeout(() => {
      this.mesaj = null;
    }, 3000);
  }
  basla(): void {
    this.tamamlandi = false;
    this.mevcutSoru = null;
    this.puan = 0;
    this.sorular.map(x => {
      x.soruldu = false;
    });
    this.kalanSure = 240;
    this.sure = setInterval(() => {
      this.kalanSure--;
      if (this.kalanSure === 0) {
        this.bitir();
      }
    }, 1000);
    this.soruVer();
    this.mesajGoster("İyi yarışmalar!");
  }
  bitir(): void {
    clearInterval(this.sure);
    this.mevcutSoru = null;
    this.tamamlandi = true;
  }
  soruVer(): void {
    this.yarismaciCevap = "";
    this.mevcutSoru = this.sorular.find(x => !x.soruldu);
    if (!this.mevcutSoru) {
      this.bitir();
      return;
    }
    this.harfler = [];
    this.mevcutSoru.cevap.split("").map(x => {
      this.harfler = [
        ...this.harfler,
        {
          harf: x,
          acildi: false
        }
      ];
    });
    this.harfPuan = this.harfler.length * 100;
    this.mevcutSoru.soruldu = true;
  }
  harfVer(): void {
    let rastgeleHarfIndex = Math.floor(Math.random() * this.harfler.length);

    if (this.harfPuan <= 100) {
      return;
    }

    let harf = this.harfler[rastgeleHarfIndex];
    while (harf.acildi) {
      rastgeleHarfIndex = Math.floor(Math.random() * this.harfler.length);
      harf = this.harfler[rastgeleHarfIndex];
    }
    harf.acildi = true;
    this.harfPuan -= 100;
  }
  cevapVer(): void {
    if (!this.yarismaciCevap.length) {
      return;
    }

    if (this.yarismaciCevap.length !== this.harfler.length) {
      this.mesajGoster("Harf sayıları tutmuyor!");
      return;
    }

    let cevap = (this.yarismaciCevap as any).toLocaleUpperCase(
      "tr-TR"
    ) as string;
    this.yarismaciCevap = cevap;

    if (
      this.yarismaciCevap ===
      ((this.mevcutSoru.cevap as any).toLocaleUpperCase("tr-TR") as string)
    ) {
      this.puan += this.harfPuan;
      this.mesajGoster("Tebrikler, doğru bildiniz!", MesajTurleri.basari);
    } else {
      this.puan -= this.harfPuan;
      this.mesajGoster(
        `Yanlış cevap, doğrusu '${this.mevcutSoru.cevap}' olmalıydı!`,
        MesajTurleri.hata
      );
    }

    this.soruVer();
  }
  enterIleCevapVer(event: KeyboardEvent): void {
    if (event.key === Tuslar.Enter) this.cevapVer();
  }

  render() {
    return (
      <div>
        {this.tamamlandi && (
          <div class="card mb-4" v-if="tamamlandi">
            <div class="card-body">
              Tebrikler yarışmayı {this.puan} puan ile tamamladınız!
            </div>
          </div>
        )}
        {!this.mevcutSoru && (
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Kelime Oyunu Yarışmasına Hoşgeldiniz!</h5>
            </div>
            <div class="card-body">
              Yarışmaya başlamak için yarışmaya başla butonuna basın.
            </div>
            <div class="card-footer">
              <button class="btn btn-primary" onClick={() => this.basla()}>
                Yarışmaya Başla
              </button>
            </div>
          </div>
        )}
        {this.mevcutSoru && (
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0">{this.mevcutSoru.soru}</h3>
            </div>
            <div class="card-body">
              <div class="d-flex">
                {this.harfler.map(hrf => (
                  <app-harf deger={hrf.harf} acik={hrf.acildi}></app-harf>
                ))}
              </div>
            </div>
            <div class="card-footer">
              <div class="d-flex">
                <div class="mr-4">Toplam Puan: {this.puan}</div>
                <div class="mr-4">
                  Kalan Süreniz: <kbd>{this.kalanSure}</kbd> saniye
                </div>
                <div>Harf Puanı: {this.harfPuan}</div>
              </div>
            </div>
            <div class="card-footer">
              <div class="input-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Cevabınızı yazın"
                  value={this.yarismaciCevap}
                  onChange={(event: any) =>
                    (this.yarismaciCevap = event.target.value)
                  }
                />
                <div class="input-group-append">
                  <button class="btn btn-danger" onClick={() => this.bitir()}>
                    Bitir
                  </button>
                  <button
                    class="btn btn-secondary"
                    onClick={() => this.harfVer()}
                  >
                    Harf Ver
                  </button>
                  <button
                    onClick={() => this.cevapVer()}
                    class="btn btn-success"
                  >
                    Cevap Ver
                  </button>
                </div>
              </div>
            </div>
            {this.mesaj && (
              <div class={"card-footer " + this.mesajClass}>{this.mesaj}</div>
            )}
          </div>
        )}
      </div>
    );
  }
}

enum MesajTurleri {
  hata,
  basari
}
enum Tuslar {
  Enter = "Enter"
}
interface Soru {
  soru: string;
  cevap: string;
  soruldu: boolean;
}
