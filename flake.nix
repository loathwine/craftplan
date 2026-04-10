{
  description = "CraftPlan - Minecraft-style project planning";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f {
        pkgs = import nixpkgs { inherit system; };
      });
    in
    {
      devShells = forAllSystems ({ pkgs }: {
        default = pkgs.mkShell {
          buildInputs = [ pkgs.nodejs_22 ];
        };
      });

      packages = forAllSystems ({ pkgs }: {
        default = pkgs.buildNpmPackage {
          pname = "craftplan";
          version = "0.1.0";
          src = ./.;
          npmDepsHash = "sha256-XLPiOKeWJBD3dx8ZKVcWUGsY3y+4idi6gL58Um8RuCg=";
          dontNpmBuild = true;
          installPhase = ''
            mkdir -p $out/{lib,bin}
            cp -r node_modules server.js public package.json $out/lib/
            cat > $out/bin/craftplan <<EOF
            #!${pkgs.bash}/bin/bash
            exec ${pkgs.nodejs_22}/bin/node $out/lib/server.js "\$@"
            EOF
            chmod +x $out/bin/craftplan
          '';
        };
      });
    };
}
