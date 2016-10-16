# Poce
Printer operation and control engine

## Raspbian configuration

### no boot messages [avoid printing letter soup ;)]

`/boot/config.txt`
```bash
# disable icon for undervoltage and overtemperature
avoid_warnings=1

# disable splash (rainbow)
disable_splash=1
```

`/boot/cmdline.txt`

```bash
... console=tty2 logo.nologo ... quiet nosplash
```

```bash
sudo systemctl disable getty@tty1
```

`/etc/kbd/config`

```bash
BLANK_TIME=0
```

## Software

### Inkscape
```bash
sudo apt-get install inkscape
inkscape --without-gui --export-png=render.png --export-id=layer19 --export-id-only --export-area-page --export-dpi=10000 --export-background=black gear_small.svg
sudo apt-get install libav-tools
avconv -y -vcodec png -i render.png -vcodec rawvideo -f rawvideo -pix_fmt rgb32 -vf pad=1024:768:120:40:blue /dev/fb0
```




### Node
[Instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
