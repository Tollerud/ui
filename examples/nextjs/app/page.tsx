import { Button, Card, Badge, StatusDot, Container, CodeBlock, NoirGlowBackground } from '@/components/ui'

export default function Home() {
  const servers = ['Emma', 'Miriam', 'Pia', 'Iris', 'Victoria', 'Embla']

  return (
    <>
      {/* Header */}
      <nav className="tia-glass fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-[15px] text-white">Tia</span>
          <Badge variant="accent">Noir</Badge>
        </div>
        <div className="ml-auto flex gap-8 text-sm">
          <a href="#" className="text-tia-text-secondary hover:text-tia-yellow transition-colors">servers</a>
          <a href="#" className="text-tia-text-secondary hover:text-tia-yellow transition-colors">logs</a>
          <a href="#" className="text-tia-text-secondary hover:text-tia-yellow transition-colors">config</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 bg-black">
        <NoirGlowBackground intensity="medium" speed="slow" grain="soft" shape="corners" preserveCenter />
        <Container className="relative z-10">
          <div className="text-center">
            <h1 className="tia-display text-[clamp(42px,7vw,70px)] mb-2">
              Tollerud
              <span className="tia-gradient-text"> Infrastructure</span>
            </h1>
            <p className="text-tia-yellow/65 text-lg mb-8 max-w-xl mx-auto">
              / HomeLab mission control. Dark. Reliable. Yellow where it counts.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="terminal" size="lg">
                open_dashboard
              </Button>
              <Button variant="secondary" size="lg">
                View Logs
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Server Status */}
      <Container className="py-16">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="tia-display--secondary text-[32px]">Servers</h2>
          <Badge variant="success">{servers.length} online</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((name) => (
            <Card key={name}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{name}</h3>
                <StatusDot status="online" />
              </div>
              <div className="space-y-1 text-sm text-tia-text-secondary">
                <p>Uptime: 14d 3h 22m</p>
                <p>CPU: 12% · MEM: 34%</p>
                <p>Docker: 7 containers</p>
              </div>
            </Card>
          ))}
        </div>

        <hr className="tia-accent-bar my-16" />

        {/* Quick Actions */}
        <h2 className="tia-display--secondary text-[32px] mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="font-semibold mb-3">System</h3>
            <div className="flex flex-col gap-2">
              <Button variant="terminal" size="sm">
                system_update --check
              </Button>
              <Button variant="ghost" size="sm">
                Backup Config
              </Button>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold mb-3">Docker</h3>
            <div className="flex flex-col gap-2">
              <Button variant="terminal" size="sm">
                compose ps --all
              </Button>
              <Button variant="ghost" size="sm">
                Restart Stack
              </Button>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold mb-3">Network</h3>
            <div className="flex flex-col gap-2">
              <Button variant="terminal" size="sm">
                ping gateway
              </Button>
              <Button variant="ghost" size="sm">
                UniFi Status
              </Button>
            </div>
          </Card>
        </div>

        <hr className="tia-divider my-16" />

        {/* Terminal Block */}
        <CodeBlock>
          <span className="text-tia-yellow">❯</span> systemctl status tia-agent<br/>
          ● tia-agent.service — Tollerud Infrastructure Assistant<br/>
          &nbsp;&nbsp;&nbsp;Loaded: loaded<br/>
          &nbsp;&nbsp;&nbsp;Active: <span className="text-tia-success">active (running)</span><br/>
          <br/>
          <span className="text-tia-noir-400 italic">// Dec 25 12:34:01 tia ready — 12 services online</span>
        </CodeBlock>
      </Container>

      <footer className="text-center py-12 border-t border-tia-border text-xs text-tia-text-muted">
        <Container>
          <p>Tia Noir · Built for the Tollerud Homelab</p>
        </Container>
      </footer>
    </>
  )
}
