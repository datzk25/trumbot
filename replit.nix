{ pkgs }: {
  deps = [
    pkgs.librsvg
    pkgs.libjpeg
    pkgs.giflib
    pkgs.cairo
    pkgs.pango
    pkgs.libuuid
    pkgs.bashInteractive
    pkgs.nodePackages.bash-language-server
    pkgs.man
  ];
}